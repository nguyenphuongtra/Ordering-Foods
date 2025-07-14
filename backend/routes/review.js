const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
