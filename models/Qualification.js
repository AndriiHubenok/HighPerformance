const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema({
    salesmanId: { type: Number, required: true },
    company: { type: String, default: "SmartHoover" },
    title: { type: String, default: "Salesman" },
    year: { type: Number, default: 2025 },
    comment: { type: String, default: "" }
});

module.exports = mongoose.model('Qualification', qualificationSchema);