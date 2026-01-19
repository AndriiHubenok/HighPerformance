const mongoose = require('mongoose');

const socialPerformanceSchema = new mongoose.Schema({
    salesmanId: { type: Number, required: true },
    description: { type: String, required: true },
    valueSupervisor: { type: Number, required: true },
    valuePeerGroup: { type: Number, required: true },
    bonusValue: { type: Number, default: 0 },
    year: { type: Number, required: true },

    remarks: { type: String, default: "" },

    isApprovedByCEO: { type: Boolean, default: false }
});

module.exports = mongoose.model('SocialPerformance', socialPerformanceSchema);