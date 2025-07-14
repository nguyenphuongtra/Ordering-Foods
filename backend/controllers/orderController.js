const Order = require("../models/Order");
const User = require("../models/User");
const Table = require("../models/Table");

exports.createOrder = async (req, res) => {
    try {
        const { userId, tableId, items, totalAmount, paymentMethod } = req.body;

        // Validation
        if (!userId || !tableId || !items || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng phải có ít nhất một món'
            });
        }

        if (totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Tổng tiền phải lớn hơn 0'
            });
        }

        // Kiểm tra user và table tồn tại
        const user = await User.findById(userId);
        const table = await Table.findById(tableId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Bàn không tồn tại'
            });
        }

        const order = await Order.create({
            user: userId,
            table: tableId,
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'cash',
            status: 'Đang xử lý'
        });

        await order.populate('user table items.food');

        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Lọc theo trạng thái
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .populate('table', 'number')
            .populate('items.food', 'name price')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách đơn hàng thành công',
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('table', 'number')
            .populate('items.food', 'name price image');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy thông tin đơn hàng thành công',
            data: order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { status } = req.body;

        // Validation trạng thái hợp lệ
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user table items.food');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật đơn hàng thành công',
            data: order
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đơn hàng đã được xóa thành công'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ user: userId })
            .populate('table', 'number')
            .populate('items.food', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Lấy đơn hàng theo người dùng thành công',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

exports.getOrdersByTable = async (req, res) => {
    try {
        const tableId = req.params.tableId;
        const orders = await Order.find({ table: tableId })
            .populate('user', 'name email')
            .populate('items.food', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Lấy đơn hàng theo bàn thành công',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Thống kê đơn hàng
exports.getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.status(200).json({
            success: true,
            message: 'Lấy thống kê đơn hàng thành công',
            data: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                statusBreakdown: stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};