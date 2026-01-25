const express = require('express');
const router = express.Router();

const Salesman = require('../models/Salesman');
const SocialPerformance = require('../models/SocialPerformance');

// --- MVP_FR2: For a given salesman, the social performance evaluation records must be managed (read and created). An individually computed bonus for a single record must be computed and displayed. ---
// --- M_FR1: The total bonus of the social performance evaluation must be computed automatically and must be displayed. ---
// --- M_FR2: Remarks to the bonus computation must be entered and stored for a single salesman.
router.post('', async (req, res) => {
    try {
        const { salesmanId, description, valueSupervisor, valuePeerGroup, year, remarks } = req.body;

        let bonusValue = (valueSupervisor + valuePeerGroup) * 30;// Simple bonus calculation logic, can be changed later

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
router.get('/:sid', async (req, res) => {
    try {
        const records = await SocialPerformance.find({ salesmanId: req.params.sid });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;