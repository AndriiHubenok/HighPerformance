const express = require('express');
const router = express.Router();

const Salesman = require('../models/Salesman');
const SocialPerformance = require('../models/SocialPerformance');
const {verifyToken, requireRole} = require("../middleware/auth");

// --- MVP_FR2: For a given salesman, the social performance evaluation records must be managed (read and created). An individually computed bonus for a single record must be computed and displayed. ---
// --- M_FR1: The total bonus of the social performance evaluation must be computed automatically and must be displayed. ---
// --- M_FR2: Remarks to the bonus computation must be entered and stored for a single salesman.
router.post('', verifyToken, requireRole(['CEO']), async (req, res) => {
    try {
        const { salesmanId, description, valueSupervisor, valuePeerGroup, year, remarks } = req.body;

        let bonusValue = (valueSupervisor + valuePeerGroup) * 30; // Simple bonus calculation logic, can be changed later

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

// Get social performance records by salesman ID
router.get('/:sid', verifyToken, requireRole(['HR', 'CEO', 'SALESMAN']), async (req, res) => {
    try {
        const records = await SocialPerformance.find({ salesmanId: req.params.sid });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- N_FR5: HR can edit social-performance parameters ---
router.put('/:recordId', verifyToken, requireRole(['HR']), async (req, res) => {
    try {
        const { recordId } = req.params;
        const { valueSupervisor, valuePeerGroup, description } = req.body;

        const record = await SocialPerformance.findById(recordId);
        if (!record) {
            return res.status(404).json({ message: "Performance record not found" });
        }

        if (description !== undefined) record.description = description;

        let valuesChanged = false;
        if (valueSupervisor !== undefined) {
            record.valueSupervisor = valueSupervisor;
            valuesChanged = true;
        }
        if (valuePeerGroup !== undefined) {
            record.valuePeerGroup = valuePeerGroup;
            valuesChanged = true;
        }

        if (valuesChanged) {
            record.bonusValue = (valueSupervisor + valuePeerGroup) * 30;
            record.isApprovedByCEO = false;
        }

        const updatedRecord = await record.save();

        res.json({
            message: "Record updated successfully",
            data: updatedRecord
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:recordId', verifyToken, requireRole(['CEO']), async (req, res) => {
    try {
        const { recordId } = req.params;

        const record = await SocialPerformance.findById(recordId);
        if (!record) {
            return res.status(404).json({ message: "Performance record not found" });
        }

        const deletedRecord = await SocialPerformance.deleteOne(record);

        res.json({
            message: "Record deleted successfully",
            data: deletedRecord
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;