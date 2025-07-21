const router = require('express').Router();
const statsController = require('../controllers/statsController');

router.get('/overview', statsController.getOverview);

module.exports = router;
