const mongoose = require('mongoose');
const orderSchema =  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    items: [{
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Đang xử lý', 'Đã hoàn thành', 'Đã hủy'], default: 'Đang xử lý' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);