const User = require('../models/User');

exports.getUsers = async (req, res) => {
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
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(user);
    } catch (error) {
        res.status(500).json({message: 'Lỗi server', error: error.message});
    }
}
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({message: 'Xóa người dùng thành công'});
    } catch (error) {
        res.status(500).json({message: 'Lỗi server', error: error.message});
    }
}