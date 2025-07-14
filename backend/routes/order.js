const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");


router.get("/", orderController.getOrders);
router.get("/stats", orderController.getOrderStats);
router.get("/user/:userId", orderController.getOrdersByUser);
router.get("/table/:tableId", orderController.getOrdersByTable);
router.get("/:id", orderController.getOrder);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;