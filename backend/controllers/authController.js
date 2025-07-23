const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ 
      email, 
      password: hashedPassword, 
      name 
    });
    
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    // req.user được set từ middleware auth
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    
    res.json({ 
      success: true,
      data: user 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};