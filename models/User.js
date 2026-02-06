const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['HR', 'CEO', 'SALESMAN'],
        required: true
    },
    linkedSalesmanId: { type: Number }
});

module.exports = mongoose.model('User', userSchema);