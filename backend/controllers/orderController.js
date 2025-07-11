const Order  = require ('../models/Order');

exports.createOrder = async(req, res) => {
    try{
        const order =  await Order.create(req.body);
        res.status(201).json(order)
    } catch(err){
        res.status(500).json({ message:'Lỗi server', error: err.message });
    }
};

exports.getOrders = async(req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders)
    } catch (err) {
        res.status(500).json({message: ' Lỗi server', error: err.message });
    }
};

exports.getOrder = async(req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng'})
        res.json(order)
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'});
    }
};

exports.updateOrder = async(req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(order);
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'})
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete(req.params.id);
        res.json(order)
    } catch (err) {
        res.status(500).json({message: 'Lỗi server'})
    }
};