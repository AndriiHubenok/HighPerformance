const mongoose = require('mongoose');

const orderPerformanceSchema = new mongoose.Schema({
    salesmanId: { type: Number, required: true }, // OrangeHRM ID
    year: { type: Number, required: true },

    orderId: { type: String, required: true },
    productName: { type: String },
    clientName: { type: String },
    clientRanking: { type: String },
    closingProbability: { type: Number },

    quantity: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "978" },

    computedBonus: { type: Number, default: 0 },

    hrReviewStatus: { type: Boolean, default: false },
    ceoReviewStatus: { type: Boolean, default: false }
});

module.exports = mongoose.model('OrderPerformance', orderPerformanceSchema);