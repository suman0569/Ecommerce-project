const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/Order");


// RAZORPAY...............................ok

const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    // Razorpay accepts amount in paise
    const options = {
      amount: req.body.amount * 100,
      currency: "Rs",
    };
    
    const order = await instance.orders.create(options);
    if (!order) 
      return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// ESEWA - INITIATE PAYMENT.........................................

const initiateEsewaPayment = async (req, res) => {
  try {
    const {items,totalAmount,address,} = req.body;
    if (!req.user || !req.user._id) {
      return res.status(401).json({success: false, message: "User authentication required",});
    }

    // Validate items......................................................

    if (
      !Array.isArray(items) || items.length === 0
    ) {
      return res.status(400).json({success: false, message: "No order items",});
    }

    // Validate amount...........................................

    const amount = Number(totalAmount);

    if (
      !Number.isFinite(amount) || amount <= 0
    ) {
      return res.status(400).json({success: false, message: "Invalid total amount",});
    }

    // Validate address..............................................

    if (!address) {
      return res.status(400).json({success: false, message: "Shipping address is required",});
    }

    // eSewa configuration..................................................

    const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
    const secretKey = process.env.ESEWA_SECRET_KEY;
    if (!secretKey) {
      console.error("ESEWA_SECRET_KEY is missing");
      return res.status(500).json({success: false, message:"eSewa secret key is not configured",});
    }

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${ process.env.PORT || 5000}`;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Generate unique transaction UUID............................................

    const transactionUuid = `Baggage-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    // eSewa signed fields......................................................

    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signatureMessage =`total_amount=${amount},` + `transaction_uuid=${transactionUuid},` + `product_code=${productCode}`;

    // Generate HMAC SHA256 Base64 signature..........................................

    const signature = crypto.createHmac("sha256", secretKey).update(signatureMessage).digest("base64");

    // Create pending order................................................................

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount: amount,
      address,
      paymentMethod: "eSewa",
      paymentStatus: "Pending",
      transactionUuid,
      status: "Pending",
    });

    await order.save();

    // eSewa payment data......................................................

    const paymentData = {
      amount: amount.toString(),
      tax_amount: "0",
      total_amount: amount.toString(),
      transaction_uuid:transactionUuid,
      product_code:productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url:`${backendUrl}/api/payment/esewa/success`,
      failure_url:`${backendUrl}/api/payment/esewa/failure`,
      signed_field_names:signedFieldNames, signature,
    };

    console.log("=================================");
    console.log("eSewa payment initialized");
    console.log("Order:", order._id);
    console.log("Amount:",amount);
    console.log("Transaction UUID:", transactionUuid);
    console.log("Product Code:",productCode);
    console.log("Signature:", signature);
    console.log("Success URL:",paymentData.success_url);
    console.log("Failure URL:",paymentData.failure_url);
    console.log("=================================");

    // Send payment data to frontend....................................................

    return res.status(200).json({success: true,
      paymentUrl: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      paymentData,
      orderId: order._id,
      transactionUuid,
      frontendUrl,
    });
  } catch (error) {
    console.error("eSewa initiation error:", error);
    return res.status(500).json({success: false, message: error.message,});
  }
};

// ESEWA - SUCCESS CALLBACK.................................................

const esewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;

    console.log("=================================");
    console.log("eSewa success callback received");
    console.log("=================================");

    // Check response data..........................................................

    if (!data) {
      console.error("eSewa callback did not contain data");
      return res.status(400).send("eSewa payment response not received");
    }

    // Decode Base64 response........................................................

    let paymentResponse;
    try {
      const decodedData = Buffer.from(data, "base64").toString("utf8");
      paymentResponse = JSON.parse(decodedData);
    } catch (error) {
      console.error("eSewa response decoding error:",error);
      return res.status(400).send("Invalid eSewa payment response");
    }

    console.log("eSewa response:", paymentResponse);

    // Extract response fields............................................

    const {transaction_uuid, transaction_code, total_amount, product_code, status, signature, signed_field_names,} = paymentResponse;

    // Validate response fields.................................................

    if (!transaction_uuid || !transaction_code || !total_amount || !product_code || !status || !signature || !signed_field_names ) {
      console.error("Incomplete eSewa payment response");
      return res.status(400).send("Incomplete eSewa payment response");
    }

    // Find order..............................................................

    const order = await Order.findOne({transactionUuid:transaction_uuid,});

    if (!order) {
      console.error("Order not found:",transaction_uuid);
      return res.status(404).send("Order not found");
    }

    // Prevent duplicate processing......................................................

    if (order.paymentStatus === "Paid") {
      console.log("Order already paid:", order._id);
      return res.redirect(`${process.env.FRONTEND_URL}/ordersuccess?payment=esewa`);
    }

    // Get secret key..............................................................

    const secretKey = process.env.ESEWA_SECRET_KEY;
    if (!secretKey) {
      console.error("ESEWA_SECRET_KEY is missing");
      return res.status(500).send("eSewa secret key is not configured");
    }

    // Verify eSewa response signature............................................

    const fields = signed_field_names.split(",");
    const signatureMessage = fields.map((field) =>`${field}=${paymentResponse[field]}`).join(",");
    const expectedSignature = crypto.createHmac("sha256", secretKey).update(signatureMessage).digest("base64");

    if (signature !== expectedSignature) {
      console.error("eSewa signature mismatch");
      order.paymentStatus ="Failed";
      order.status = "Cancelled";
      await order.save();

      return res.status(400).send("Invalid eSewa signature");
    }

    console.log("eSewa signature verified");

    // Verify amount from callback.......................................

    if (Number(total_amount) !== Number(order.totalAmount)) {
      console.error("eSewa amount mismatch",
        {
          esewaAmount:
            total_amount,

          orderAmount:
            order.totalAmount,
        }
      );

      order.paymentStatus = "Failed";
      order.status = "Cancelled";
      await order.save();
      return res.status(400).send( "Payment amount mismatch");
    }

    // Check payment status.....................................

    if (status !== "COMPLETE") {
      console.log("eSewa payment status:",status);

      order.paymentStatus = "Failed";
      order.status ="Cancelled";
      await order.save();
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    // Verify transaction with eSewa..............................................

    const statusUrl = process.env.ESEWA_STATUS_URL || "https://rc.esewa.com.np/api/epay/transaction/status/";

    const verificationUrl = `${statusUrl}` + `?product_code=${encodeURIComponent( product_code)}` + `&total_amount=${encodeURIComponent(total_amount)}` + `&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;
    console.log("Verifying eSewa transaction:");
    console.log(verificationUrl);

    // Call eSewa status API..................................

    const verificationResponse = await fetch(verificationUrl);
    const responseText = await verificationResponse.text();
    console.log("eSewa verification HTTP status:", verificationResponse.status);

    console.log("eSewa verification raw response:",responseText);

    // Check HTTP response.........................................

    if (!verificationResponse.ok) {
      console.error("eSewa verification API error:",verificationResponse.status,responseText);
      return res.status(502).send("Unable to verify eSewa transaction");
    }

    // Parse verification response.............................................

    let verificationData;
    try {
      verificationData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Invalid JSON received from eSewa:",parseError);
      return res.status(502).send("Invalid response from eSewa");
    }
    console.log("eSewa verification:",verificationData);

    // Check verified transaction status................................................
    if (verificationData.status !== "COMPLETE") {
      console.error("eSewa verification status:",verificationData.status);
      order.paymentStatus = "Failed";
      order.status = "Cancelled";
      await order.save();
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    // Verify amount from status API.....................................................
    if (Number(verificationData.total_amount) !== Number(order.totalAmount)){
      console.error("Verified payment amount mismatch",
        {
          verifiedAmount:
            verificationData.total_amount,

          orderAmount:
            order.totalAmount,
        }
      );

      order.paymentStatus = "Failed";
      order.status = "Cancelled";
      await order.save();
      return res.status(400).send("Verified payment amount mismatch");
    }

    // PAYMENT SUCCESS....................................

    order.paymentStatus ="Paid";
    order.paymentId = transaction_code || verificationData.ref_id;
    await order.save();
    console.log("=================================");
    console.log("eSewa payment verified successfully");
    console.log({
      orderId:order._id,
      transactionUuid:transaction_uuid,
      paymentId:order.paymentId,
      amount:order.totalAmount,
    });

    console.log("================================="); 
    return res.redirect(`${process.env.FRONTEND_URL}/ordersuccess?payment=esewa`);

  } catch (error) {
    console.error("eSewa success callback error:", error);

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

// ESEWA - FAILURE CALLBACK....................................

const esewaFailure = async (req, res) => {
  try {
    console.log("=================================");
    console.log("eSewa failure callback:");
    console.log("Query:", req.query);
    console.log("=================================");
    const { data } = req.query;

    // Decode failure response if available...........................................

    if (data) {
      try {
        const decodedData = Buffer.from(data, "base64").toString("utf8");
        const paymentResponse = JSON.parse(decodedData);
        console.log("eSewa failure response:",paymentResponse);

        if (paymentResponse.transaction_uuid) {
          await Order.findOneAndUpdate(
            {
              transactionUuid:
                paymentResponse.transaction_uuid,
            },
            {
              paymentStatus:
                "Failed",

              status:
                "Cancelled",
            }
          );
        }
      } catch (decodeError) {
        console.error("Could not decode eSewa failure data:", decodeError.message);
      }
    }

    // Redirect to frontend.............................................

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);

  } catch (error) {
    console.error("eSewa failure error:", error
    );

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

module.exports = {createOrder, verifyPayment, initiateEsewaPayment, esewaSuccess, esewaFailure,};