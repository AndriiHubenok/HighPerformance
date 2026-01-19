const express = require('express');
const router = express.Router();

const Salesman = require('../models/Salesman');


// --- MVP_FR1: Basic master data of a salesman (name, employee ID, department, year of performance) must be managed (created and read). ---
router.post('', async (req, res) => {
    try {
        const salesman = new Salesman(req.body);
        const savedSalesman = await salesman.save();
        res.status(201).json(savedSalesman);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// We can use query parameters to filter by sid and yearOfPerformance but both are optional
router.get('', async (req, res) => {
    try {
        const query = {};
        if (req.query.sid) query.sid = req.query.sid;
        if (req.query.year) query.yearOfPerformance = req.query.year;

        const salesmen = await Salesman.find(query);
        res.json(salesmen);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;