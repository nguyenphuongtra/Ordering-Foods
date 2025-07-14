const express = require('express');
const router = express.Router();
const adminMiddleware = require("../middleware/admin");
const foodController = require("../controllers/foodController");
const orderController = require("../controllers/orderController");
const userController = require("../controllers/userController");

router.get("/foods", adminMiddleware, foodController.getFoods);
router.get("/foods/:id", adminMiddleware, foodController.getFood);
router.post("/foods", adminMiddleware, foodController.createFood);
router.put("/foods/:id", adminMiddleware, foodController.updateFood);
router.delete("/foods/:id", adminMiddleware, foodController.deleteFood);

router.get("/orders", adminMiddleware, orderController.getOrders);
router.get("/orders/stats", adminMiddleware, orderController.getOrderStats);
router.get("/orders/user/:userId", adminMiddleware, orderController.getOrdersByUser);
router.get("/orders/table/:tableId", adminMiddleware, orderController.getOrdersByTable);
router.get("/orders/:id", adminMiddleware, orderController.getOrder);
router.post("/orders", adminMiddleware, orderController.createOrder);
router.put("/orders/:id", adminMiddleware, orderController.updateOrder);
router.delete("/orders/:id", adminMiddleware, orderController.deleteOrder);

router.get("/users", adminMiddleware, userController.getUsers);
router.get("/users/stats", adminMiddleware, userController.getUserStats);
router.get("/users/:id", adminMiddleware, userController.getUserById);
router.post("/users", adminMiddleware, userController.createUser);
router.put("/users/:id", adminMiddleware, userController.updateUser);
router.delete("/users/:id", adminMiddleware, userController.deleteUser);

module.exports = router;