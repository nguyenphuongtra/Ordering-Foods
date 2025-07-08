const Category = require("../models/Category");

exports.getCategorys = async ( req, res) => {
    try {
       const categories = await Category.find();
       res.json(categories); 
    } catch (error) {
        res.status(500).json({message: 'Lỗi server', error: error.message});
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json({ message: 'Danh mục đã được xóa thành công' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}
