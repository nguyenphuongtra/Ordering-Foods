const mongoose =  require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    totalAmount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
