const jwt = require('jsonwebtoken');
const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Không có token" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};