const Cart = require("../models/Cart");
const Food = require("../models/Food");

exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId }).populate('items.food');

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Món ăn không tồn tại' });
    }

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ food: foodId, quantity }],
        totalAmount: food.price * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.food._id.toString() === foodId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ food: foodId, quantity });
      }

      // Cập nhật lại totalAmount
      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.food.price,
        0
      );
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Đã thêm vào giỏ hàng', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};



exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        let cart = await Cart.findOne({ user: userId }).populate('items.food');
        
        if (!cart) {
            // Nếu không tìm thấy giỏ hàng, tạo một giỏ hàng mới cho người dùng
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
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
    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.food');
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const item = cart.items.find((item) => item.food._id.toString() === foodId);
    if (!item) return res.status(404).json({ message: 'Món ăn không có trong giỏ' });

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.food.price,
      0
    );

    await cart.save();
    res.status(200).json({ success: true, message: 'Đã cập nhật giỏ hàng', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.food');
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    cart.items = cart.items.filter((item) => item.food._id.toString() !== foodId);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.food.price,
      0
    );

    await cart.save();
    res.status(200).json({ success: true, message: 'Đã xoá khỏi giỏ hàng', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();
    res.status(200).json({ success: true, message: 'Đã xoá toàn bộ giỏ hàng' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
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
