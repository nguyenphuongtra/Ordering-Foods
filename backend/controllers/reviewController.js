const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
    try {
        const filter = {};
        if (req.query.food) filter.food = req.query.food;
        if (req.query.user) filter.user = req.query.user;
        const reviews = await Review.find(filter)
            .populate('user', 'name avatar')
            .populate('food', 'name image');
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách review thành công',
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('food', 'name image');
        if (!review) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy review' });
        }
        res.status(200).json({
            success: true,
            message: 'Lấy chi tiết review thành công',
            data: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { food, rating, comment, image } = req.body;
        if (!food || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        const existing = await Review.findOne({ user: req.user._id, food });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Bạn đã review món này rồi' });
        }
        const review = await Review.create({
            user: req.user._id,
            food,
            rating,
            comment,
            image
        });
        await review.populate('user', 'name avatar');
        await review.populate('food', 'name image');
        res.status(201).json({
            success: true,
            message: 'Tạo review thành công',
            data: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy review' });
        }
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa review này' });
        }
        const { rating, comment, image } = req.body;
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        if (image !== undefined) review.image = image;
        await review.save();
        await review.populate('user', 'name avatar');
        await review.populate('food', 'name image');
        res.status(200).json({
            success: true,
            message: 'Cập nhật review thành công',
            data: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy review' });
        }
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa review này' });
        }
        await review.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Xóa review thành công'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
