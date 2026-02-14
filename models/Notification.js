const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipientRole: {
        type: String,
        required: true,
        enum: ['CEO', 'HR', 'SALESMAN']
    },
    recipientUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        required: true,
        enum: ['BONUS_REJECTED', 'BONUS_APPROVED', 'BONUS_PENDING', 'INFO']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedSalesmanId: {
        type: Number
    },
    relatedYear: {
        type: Number
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);

