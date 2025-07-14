const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const auth = require('../middleware/auth');


router.get("/", userController.getUsers);
router.get("/stats",userController.getUserStats);
router.get("/:id", userController.getUserById);
router.post("/",userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);




module.exports = router;


