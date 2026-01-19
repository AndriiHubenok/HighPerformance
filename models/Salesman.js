const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
    sid: { type: Number, required: true, unique: true },
    governmentId: { type: String, required: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    department: { type: String, default: "Sales" },
    yearOfPerformance: { type: Number, default: 2025 }
});

module.exports = mongoose.model('Salesman', salesmanSchema);