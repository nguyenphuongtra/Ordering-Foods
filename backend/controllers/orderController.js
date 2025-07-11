const Order = require("../models/Order");
const User = require("../models/User");
const Table = require("../models/table");

exports.createOrder = async (req, res) => {
    try {
        const { userId, tableId, items, totalAmount } = req.body;

        if (!userId || !tableId || !items || !totalAmount) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        const order = await Order.create({
            user: userId,
            table: tableId,
            items,
            totalAmount
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user table');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user table');
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
exports.updateOrder = async (req, res) => {
    try {
        const { userId, tableId, items, totalAmount } = req.body;

        if (!userId || !tableId || !items || !totalAmount) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, {
            user: userId,
            table: tableId,
            items,
            totalAmount
        }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json({ message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId }).populate('table');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

exports.getOrdersByTable = async (req, res) => {
    try {
        const tableId = req.params.tableId;
        const orders = await Order.find({ table: tableId }).populate('user');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

