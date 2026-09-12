const express = require("express");

const {
  createOrder,
  verifyPayment,
  initiateEsewaPayment,
  esewaSuccess,
  esewaFailure,
} = require("../controller/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Razorpay
router.post("/order", createOrder);
router.post("/verify", verifyPayment);

// eSewa
router.post(
  "/esewa/initiate",
  protect,
  initiateEsewaPayment
);

router.get(
  "/esewa/success",
  esewaSuccess
);

router.get(
  "/esewa/failure",
  esewaFailure
);

module.exports = router;