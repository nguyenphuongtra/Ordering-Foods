const Food  = require('../models/Food');
const Order = require('../models/Order');
const User  = require('../models/User');


exports.getOverview = async (_req, res, next) => {
  try {
    const [foods, orders, users, revenueAgg] = await Promise.all([
      Food.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['Đang xử lý', 'Đã hoàn thành'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        foods,
        orders,
        users,
        revenue: revenueAgg[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
};
