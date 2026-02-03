const express = require('express');
const router = express.Router();

const Salesman = require('../models/Salesman');
const OrderPerformance = require('../models/OrderPerformance');
const SocialPerformance = require('../models/SocialPerformance');
const Qualification = require('../models/Qualification');
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

// --- M_FR4: The CEO must be involved in the process for fetching the data and for approving the bonus computation. ---
// CEO approves bonus for a salesman for a given year (*need to be authenticated as CEO in future)
// Note: This endpoint is now replaced by the final approval endpoint below
// router.post('/approve/:sid/:year', async (req, res) => {
//     const { sid, year } = req.params;
//
//     try {
//         const records = await SocialPerformance.find({ salesmanId: sid, year: year });
//
//         if (records.length === 0) return res.status(404).json({ msg: "No records found" });
//
//         const totalBonus = records.reduce((sum, record) => sum + record.bonusValue, 0);
//
//         await SocialPerformance.updateMany(
//             { salesmanId: sid, year: year },
//             { $set: { isApprovedByCEO: true } }
//         );
//
//         const hrmResult = await orangeHrmService.saveBonusToOrangeHRM(sid, totalBonus, year);
//
//         res.json({
//             message: "Bonus approved and sent to HR system",
//             salesmanId: sid,
//             totalBonus: totalBonus,
//             hrmSyncStatus: hrmResult
//         });
//
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

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
            const bonus = openCrxService.calculateOrderBonus(order);

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
// --- C_FR9: Salesman can see qualific. at the end ---
// We simply calculate and return total bonuses from social performance without saving
router.get('/cockpit/:sid/:year', async (req, res) => {
    try {
        const { sid, year } = req.params;

        const socialRecords = await SocialPerformance.find({ salesmanId: sid, year });
        const socialTotal = socialRecords.reduce((sum, r) => sum + r.bonusValue, 0);

        const orderRecords = await OrderPerformance.find({ salesmanId: sid, year });
        const ordersTotal = orderRecords.reduce((sum, r) => sum + r.computedBonus, 0);

        const totalBonus = socialTotal + ordersTotal;

        const qualifications = await Qualification.find({ salesmanId: sid, year });

        res.json({
            salesmanId: sid,
            year: year,
            socialBonus: { total: socialTotal, details: socialRecords },
            ordersBonus: { total: ordersTotal, details: orderRecords },
            grandTotal: totalBonus,
            qualifications: qualifications
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- C_FR5: Both the CEO and the HR assistant are involved in a process for approving the bonus computation ---
// CEO endpoint for final approval of all bonuses for a salesman for a given year and also for fetching qualifications
router.post('/approve/final/hr/:sid/:year', async (req, res) => {
    const { sid, year } = req.params;

    try {
        const socialRecords = await SocialPerformance.find({ salesmanId: sid, year });
        const orderRecords = await OrderPerformance.find({ salesmanId: sid, year });

        const totalBonus =
            socialRecords.reduce((s, r) => s + r.bonusValue, 0) +
            orderRecords.reduce((s, r) => s + r.computedBonus, 0);

        await OrderPerformance.updateMany({ salesmanId: sid, year }, { hrReviewStatus: true });

        let bonusResult

        if(orderRecords.filter(o => !o.ceoReviewStatus).length === 0){
            bonusResult = {success: "Bonus sent to salesman"};
        } else {
            bonusResult = {success: "CEO review pending, bonus not sent to salesman"};
        }

        res.json({
            status: "Approved",
            finalBonus: totalBonus,
            bonusStatus: bonusResult,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- C_FR3: The resulting total bonus resulting from both social performance and orders evaluation should be stored in OrangeHRM ---
// --- C_FR5: Both the CEO and the HR assistant are involved in a process for approving the bonus computation ---
// --- C_FR8: The qualifications of a salesman should be created by CEO. They should be stored in OrangeHRM ---
// CEO endpoint for final approval of all bonuses for a salesman for a given year and also for fetching qualifications
router.post('/approve/final/ceo/:sid/:year', async (req, res) => {
    const { sid, year } = req.params;
    const { qualification } = req.body; // I am not sure fully about it, but let's assume CEO can add new qualification

    try {
        const socialRecords = await SocialPerformance.find({ salesmanId: sid, year });
        const orderRecords = await OrderPerformance.find({ salesmanId: sid, year });

        const totalBonus =
            socialRecords.reduce((s, r) => s + r.bonusValue, 0) +
            orderRecords.reduce((s, r) => s + r.computedBonus, 0);

        await SocialPerformance.updateMany({ salesmanId: sid, year }, { isApprovedByCEO: true });
        await OrderPerformance.updateMany({ salesmanId: sid, year }, { ceoReviewStatus: true });

        let qualResult = null;
        if (qualification) {
            const newQualification = new Qualification({
                salesmanId: sid,
                company: 'SmartHoover',
                title: 'Salesman',
                year: year,
                comment: qualification
            });
            qualResult = await newQualification.save();
        }

        let bonusResult;

        if(orderRecords.filter(o => !o.hrReviewStatus).length === 0){
            bonusResult = {success: "Bonus sent to salesman"};
        } else{
            bonusResult = {success: "HR review pending, bonus not sent to salesman"};
            qualResult = null;
        }

        res.json({
            status: "Approved",
            finalBonus: totalBonus,
            bonusStatus: bonusResult,
            qualificationStatus: qualResult
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- N_FR4: The salesman can confirm the bonus computation in the end of the process. ---
// Final approval endpoint for salesman to confirm or reject the computed bonus. Approval param is boolean 'true' or 'false'
router.post('/approve/final/salesman/:sid/:year/:approval', async (req, res) => {
    const { sid, year, approval } = req.params;

    try {
        const socialRecords = await SocialPerformance.find({ salesmanId: sid, year });
        const orderRecords = await OrderPerformance.find({ salesmanId: sid, year });
        let bonusResult

        // Disapproval case
        if(approval === 'false'){
            await SocialPerformance.updateMany({ salesmanId: sid, year }, { isApprovedByCEO: false });
            await OrderPerformance.updateMany({ salesmanId: sid, year }, {
                ceoReviewStatus: false, hrReviewStatus: false});

            await Qualification.deleteMany({ salesmanId: sid, year })

            bonusResult = {success: "Bonus disapproved by salesman, bonus sent back to HR and CEO"};
            res.json({
                status: "Disapproved",
                finalBonus: 0,
                hrmBonusStatus: bonusResult
            });
            return
        }

        if(orderRecords.filter(o => !o.ceoReviewStatus).length !== 0 || orderRecords.filter(o => !o.hrReviewStatus).length !== 0){
            bonusResult = {success: "Bonus not approved by CEO or HR, bonus not sent to HRM"};
            res.json({
                status: "Rejected",
                finalBonus: 0,
                hrmBonusStatus: bonusResult,
            }).status(400);
            return
        }

        const totalBonus =
            socialRecords.reduce((s, r) => s + r.bonusValue, 0) +
            orderRecords.reduce((s, r) => s + r.computedBonus, 0);

        await OrderPerformance.updateMany({ salesmanId: sid, year }, { isApproved: true });

        bonusResult = await orangeHrmService.saveBonusToOrangeHRM(sid, totalBonus, year);

        const qualifications = await Qualification.find({ salesmanId: sid, year });
        let qualificationResult= [];
        for(const qualification of qualifications) {
            qualificationResult.push(await orangeHrmService.saveQualificationToOrangeHRM(sid, qualification.title, qualification.comment, qualification.company));
        }

        res.json({
            status: "Approved",
            finalBonus: totalBonus,
            bonusStatus: bonusResult,
            qualificationResult: qualificationResult
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dashboard statistics endpoint - returns aggregated real data
router.get('/dashboard/stats', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        // Get all salesmen
        const salesmen = await Salesman.find({});

        // Get all social performance records
        const socialRecords = await SocialPerformance.find({});

        // Get all order performance records
        const orderRecords = await OrderPerformance.find({});

        // Calculate totals
        const totalSocialBonus = socialRecords.reduce((sum, r) => sum + (r.bonusValue || 0), 0);
        const totalOrderBonus = orderRecords.reduce((sum, r) => sum + (r.computedBonus || 0), 0);

        // Get unique departments
        const departments = [...new Set(salesmen.map(s => s.department).filter(Boolean))];

        // Active this year
        const activeThisYear = salesmen.filter(s => s.yearOfPerformance === currentYear).length;

        // Performance data by salesman (for bar chart)
        const performanceByPerson = await Promise.all(
            salesmen.slice(0, 5).map(async (salesman) => {
                const socialSum = socialRecords
                    .filter(r => r.salesmanId === salesman.sid)
                    .reduce((sum, r) => sum + (r.bonusValue || 0), 0);

                const orderSum = orderRecords
                    .filter(r => r.salesmanId === salesman.sid)
                    .reduce((sum, r) => sum + (r.computedBonus || 0), 0);

                return {
                    name: `${salesman.firstname || ''} ${salesman.lastname || ''}`.trim() || `ID: ${salesman.sid}`,
                    socialBonus: socialSum,
                    orderBonus: orderSum,
                    totalBonus: socialSum + orderSum
                };
            })
        );

        // Bonus distribution (for pie chart)
        const bonusDistribution = [
            { name: 'Social Bonus', value: totalSocialBonus },
            { name: 'Order Bonus', value: totalOrderBonus }
        ];

        // Average performance score (based on supervisor and peer values)
        const avgPerformance = socialRecords.length > 0
            ? Math.round(
                socialRecords.reduce((sum, r) => sum + ((r.valueSupervisor + r.valuePeerGroup) / 2), 0) / socialRecords.length
            )
            : 0;

        res.json({
            stats: {
                totalSalesmen: salesmen.length,
                activeThisYear: activeThisYear,
                departmentsCount: departments.length,
                avgPerformance: avgPerformance,
                totalSocialBonus: totalSocialBonus,
                totalOrderBonus: totalOrderBonus,
                grandTotalBonus: totalSocialBonus + totalOrderBonus
            },
            performanceByPerson: performanceByPerson.filter(p => p.totalBonus > 0 || p.name),
            bonusDistribution: bonusDistribution,
            recentSalesmen: salesmen.slice(0, 5)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;