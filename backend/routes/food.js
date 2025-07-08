const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.get('/', foodController.getFoods);
router.get('/:id', foodController.getFood);
router.post('/', foodController.createFood);
router.put('/:id', foodController.updateFood);
router.delete('/:id', foodController.deleteFood);

module.exports = router;