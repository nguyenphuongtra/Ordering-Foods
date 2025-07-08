const User = require('../models/User');

exports.getUser = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);  
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');
        if(!user){
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Lỗi server', error: error.message});
    }
}