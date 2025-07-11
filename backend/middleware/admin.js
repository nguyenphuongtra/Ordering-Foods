const jwt =  require('jsonwebtoken');
const User =  require("../models/User");

module.exports = async( req, res, next) => {
    try {
        const token =  req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json({message: "Không có token"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user =  await User.findById(decoded.id);

        if(!user || user.role !== " admin"){
            return res.status(401).json({message: "Bạn không có quyền truy cập"});
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(500).json({message: "Token không hợp lệ"});
    }
};