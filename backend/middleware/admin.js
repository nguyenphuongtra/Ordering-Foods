const jwt = require('jsonwebtoken');
const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Không có token hoặc format token không đúng"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền truy cập"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ"
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn"
            });
        }
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: err.message
        });
    }
};