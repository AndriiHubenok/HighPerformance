const express = require('express');
const router = express.Router();

const Salesman = require('../models/Salesman');
const SocialPerformance = require('../models/SocialPerformance');

// --- MVP_FR2: For a given salesman, the social performance evaluation records must be managed (read and created). An individually computed bonus for a single record must be computed and displayed. ---
router.post('', async (req, res) => {
    try {
        const recordData = req.body;

        const salesmanExists = await Salesman.findOne({ sid: recordData.salesmanId });
        if (!salesmanExists) {
            return res.status(404).json({ message: "Salesman not found" });
        }

        const bonusValue = (recordData.valueSupervisor + recordData.valuePeerGroup) * 100;

        const newRecord = new SocialPerformance({
            ...recordData,
            bonusValue: bonusValue
        });

        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);

    } catch (err) {
        res.status(400).json({ message: err.message });
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