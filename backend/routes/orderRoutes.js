const express = require("express");

const {
  addOrderItems,
  getOrders,
  updateOrderStatus,
  getMyOrders,
} = require("../controller/orderController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router
  .route("/myOrders")
  .get(protect, getMyOrders);

router
  .route("/:id/status")
  .put(protect, admin, updateOrderStatus);

module.exports = router;