const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require("../controllers/userController")


router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById)


module.exports = router;


