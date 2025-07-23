const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
    try {
        const { userId, foodId, quantity } = req.body;

        if (!userId || !foodId || !quantity) {
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin' 
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Số lượng phải lớn hơn 0' 
            });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }


        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ food: foodId, quantity });
        }

        await cart.save();
        

        await cart.populate('items.food');

        res.status(201).json({
            success: true,
            message: 'Thêm vào giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};


exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId }).populate('items.food');
        
        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Giỏ hàng không tìm thấy' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};


exports.updateCart = async (req, res) => {
    try {
        const { userId, foodId, quantity } = req.body;


        if (!userId || !foodId || quantity === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin' 
            });
        }

        if (quantity < 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Số lượng không được âm' 
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Giỏ hàng không tìm thấy' 
            });
        }

        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

        if (itemIndex > -1) {
            if (quantity === 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            
            await cart.save();
            await cart.populate('items.food');
            
            res.status(200).json({
                success: true,
                message: 'Cập nhật giỏ hàng thành công',
                data: cart
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: 'Món ăn không có trong giỏ hàng' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, foodId } = req.body;

        if (!userId || !foodId) {
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin' 
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Giỏ hàng không tìm thấy' 
            });
        }

        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            await cart.populate('items.food');
            
            res.status(200).json({
                success: true,
                message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
                data: cart
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: 'Món ăn không có trong giỏ hàng' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Giỏ hàng không tìm thấy' 
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Xóa toàn bộ giỏ hàng thành công',
            data: cart
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};

exports.getCartCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: 'Giỏ hàng trống',
                data: { count: 0 }
            });
        }

        const count = cart.items.reduce((total, item) => total + item.quantity, 0);

        res.status(200).json({
            success: true,
            message: 'Lấy số lượng giỏ hàng thành công',
            data: { count }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};