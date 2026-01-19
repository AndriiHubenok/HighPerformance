const express = require('express');
const router = express.Router();

const Salesman = require('../models/Salesman');
const OrderPerformance = require('../models/OrderPerformance');
const SocialPerformance = require('../models/SocialPerformance');
const orangeHrmService = require('../services/orangeHrmService');
const openCrxService = require('../services/openCrxService');

// --- M_FR5: The master data of a salesman (cf. first box in the bonus computation sheet) should be read from OrangeHRM. ---
// Before starting work, we pull data from OrangeHRM into the database with this endpoint
router.post('/integration/orangehrm/sync-employees', async (req, res) => {
    try {
        let employees = await orangeHrmService.getAllEmployees()
        employees = employees.filter(emp =>{
            if(emp && emp.unit){
                return emp.unit.toLowerCase().includes('sales')
            } else{
                return false
            }
        });

        let importedCount = 0;
        for (const emp of employees) {

            await Salesman.findOneAndUpdate(
                { sid: emp.employeeId },
                {
                    governmentId: emp.code,
                    firstname: emp.firstName,
                    lastname: emp.lastName,
                    jobTitle: emp.jobTitle,
                    department: emp.unit
                },
                { upsert: true, new: true }
            );
            importedCount++;
        }
        res.json({ message: `Successfully synced ${importedCount} salesmen from OrangeHRM` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- M_FR1: The total bonus of the social performance evaluation must be computed automatically and must be displayed. ---
// --- M_FR2: Remarks to the bonus computation must be entered and stored for a single salesman.
router.post('/social-performance', async (req, res) => {
    try {
        const { salesmanId, description, valueSupervisor, valuePeerGroup, year, remarks } = req.body;

        let bonusValue = (valueSupervisor + valuePeerGroup) * 100;// Simple bonus calculation logic, can be changed later

        const record = new SocialPerformance({
            salesmanId, description, valueSupervisor, valuePeerGroup, year,
            bonusValue,
            remarks,
            isApprovedByCEO: false
        });

        await record.save();
        res.json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- M_FR4: The CEO must be involved in the process for fetching the data and for approving the bonus computation. ---
// CEO approves bonus for a salesman for a given year (*need to be authenticated as CEO in future)
router.post('/approve/:sid/:year', async (req, res) => {
    const { sid, year } = req.params;

    try {
        const records = await SocialPerformance.find({ salesmanId: sid, year: year });

        if (records.length === 0) return res.status(404).json({ msg: "No records found" });

        const totalBonus = records.reduce((sum, record) => sum + record.bonusValue, 0);

        await SocialPerformance.updateMany(
            { salesmanId: sid, year: year },
            { $set: { isApprovedByCEO: true } }
        );

        const hrmResult = await orangeHrmService.saveBonusToOrangeHRM(sid, totalBonus, year);

        res.json({
            message: "Bonus approved and sent to HR system",
            salesmanId: sid,
            totalBonus: totalBonus,
            hrmSyncStatus: hrmResult
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- C_FR1: The orders evaluation should be displayed for a given salesman together with the individually computed bonus for each sales order statement ---
// --- C_FR4: The product names, client data, client ranking, closing probability, and the number of items should be fetched from OpenCRX ---
// --- C_FR7: The bonus computations should be stored persistently, so that it can be retrieved later from both HR assistant and CEO ---
// Process of fetching orders from OpenCRX, computing bonuses and save it to DB
router.post('/orders/fetch/:sid/:year', async (req, res) => {
    try {
        const { sid, year } = req.params;

        const salesman = await Salesman.findOne({ sid: Number(sid) });
        if(!salesman) return res.status(404).json({ error: "Salesman not found" });

        const crxId = await openCrxService.getCrxIdByGovernmentId(salesman.governmentId);
        if(!crxId) return res.status(404).json({ error: "Salesman in crx not found" });

        const crxOrders = await openCrxService.getSalesDataForEmployee(crxId, year);

        const savedRecords = [];

        for (const order of crxOrders) {
            const bonus = calculateOrderBonus(order);

            const record = await OrderPerformance.findOneAndUpdate(
                { orderId: order.orderId },
                {
                    salesmanId: sid,
                    year: year,
                    productName: order.productName,
                    clientName: order.clientName,
                    clientRanking: order.clientRanking.toString(),
                    closingProbability: order.closingProbability,
                    quantity: order.quantity,
                    amount: order.amount,
                    currency: order.currency,
                    computedBonus: bonus,
                    hrReviewStatus: false,
                    ceoReviewStatus: false
                },
                { upsert: true, new: true }
            );
            savedRecords.push(record);
        }

        res.json({
            message: `Processed ${savedRecords.length} orders for salesman ${sid}`,
            data: savedRecords
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- C_FR2: For a given salesman, the total bonus should be displayed based on the orders evaluation ---
// --- C_FR6: The salesman can see the bonus computation in the end of the process ---
// We simply calculate and return total bonuses from social performance without saving
router.get('/cockpit/:sid/:year', async (req, res) => {
    try {
        const { sid, year } = req.params;

        const socialRecords = await SocialPerformance.find({ salesmanId: sid, year });
        const socialTotal = socialRecords.reduce((sum, r) => sum + r.bonusValue, 0);

        const orderRecords = await OrderPerformance.find({ salesmanId: sid, year });
        const ordersTotal = orderRecords.reduce((sum, r) => sum + r.computedBonus, 0);

        const totalBonus = socialTotal + ordersTotal;

        res.json({
            salesmanId: sid,
            year: year,
            socialBonus: { total: socialTotal, details: socialRecords },
            ordersBonus: { total: ordersTotal, details: orderRecords },
            grandTotal: totalBonus,
            // For now this is mocked, in future I will think about this one
            qualifications: ["Java Certified", "Negotiation Master"]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- C_FR3: The resulting total bonus resulting from both social performance and orders evaluation should be stored in OrangeHRM ---
// --- C_FR5: Both the CEO and the HR assistant are involved in a process for approving the bonus computation ---
// --- ???C_FR8: The qualifications of a salesman should be created by CEO. They should be stored in OrangeHRM ---

// CEO endpoint for final approval of all bonuses for a salesman for a given year and also for fetching qualifications
router.post('/approve/final/:sid/:year', async (req, res) => {
    const { sid, year } = req.params;
    const { newQualification } = req.body; // I am not sure fully about it, but let's assume CEO can add new qualification

    try {
        const socialRecords = await SocialPerformance.find({ salesmanId: sid, year });
        const orderRecords = await OrderPerformance.find({ salesmanId: sid, year });

        const totalBonus =
            socialRecords.reduce((s, r) => s + r.bonusValue, 0) +
            orderRecords.reduce((s, r) => s + r.computedBonus, 0);

        await SocialPerformance.updateMany({ salesmanId: sid, year }, { isApprovedByCEO: true });
        await OrderPerformance.updateMany({ salesmanId: sid, year }, { ceoReviewStatus: true });

        const bonusResult = await orangeHrmService.saveBonusToOrangeHRM(sid, totalBonus, year);

        let qualResult = null;
        if (newQualification) {
            // Mocked for now
            // qualResult = await orangeHrmService.addQualification(sid, newQualification);
            qualResult = "Mock: Qualification added";
        }

        res.json({
            status: "Approved",
            finalBonus: totalBonus,
            hrmBonusStatus: bonusResult,
            qualificationStatus: qualResult
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Also, we should think about the bonus calculation logic, for now it's a simple example
const calculateOrderBonus = (order) => {

    const rankingFactor = 1 + (order.clientRanking * 0.15);

    const baseBonus = order.amount * 0.05;

    const total = baseBonus * rankingFactor;

    return Math.round(total);
};

module.exports = router;