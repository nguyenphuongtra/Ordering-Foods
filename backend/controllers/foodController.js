const Food = require('../models/Food');

exports.createFood = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;

        // Validation
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin bắt buộc (tên, giá, danh mục)'
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Giá phải lớn hơn 0'
            });
        }

        // Kiểm tra trùng tên
        const existingFood = await Food.findOne({ name });
        if (existingFood) {
            return res.status(400).json({
                success: false,
                message: 'Tên món ăn đã tồn tại'
            });
        }

        const food = await Food.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo món ăn thành công',
            data: food
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

exports.getFoods = async (req, res) => {
    try {
        // Tìm kiếm và lọc
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }

        const foods = await Food.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách món ăn thành công',
            data: {
                foods
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

exports.getFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy thông tin món ăn thành công',
            data: food
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const { name, price } = req.body;

        // Validation
        if (price && price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Giá phải lớn hơn 0'
            });
        }

        // Kiểm tra trùng tên (nếu có thay đổi tên)
        if (name) {
            const existingFood = await Food.findOne({ 
                name, 
                _id: { $ne: req.params.id } 
            });
            if (existingFood) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên món ăn đã tồn tại'
                });
            }
        }

        const food = await Food.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật món ăn thành công',
            data: food
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa món ăn thành công',
            data: food
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: err.message
        });
    }
};