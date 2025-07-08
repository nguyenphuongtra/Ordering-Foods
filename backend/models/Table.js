const mongoose = require('mongoose');
const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    qrCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Trống', 'Đã đặt'], default: 'Trống' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);