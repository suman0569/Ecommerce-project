import React, { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";

const OrderSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentMethod = searchParams.get("payment");

    console.log("OrderSuccess payment method:", paymentMethod);

    // Clear cart after successful eSewa payment
    if (paymentMethod === "esewa") {
      console.log("Clearing cart after eSewa payment...");

      dispatch(clearCart());

      // Remove ?payment=esewa from URL
      navigate("/ordersuccess", {
        replace: true,
      });
    }
  }, [dispatch, navigate, searchParams]);

  const containerStyle = {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "50px 30px",
    background: "#18181b",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "#10b981",
        }}
      >
        Payment Successful!
      </h2>

      <p
        style={{
          color: "#a1a1aa",
          fontSize: "1.2rem",
          marginBottom: "40px",
        }}
      >
        Thank you for your order. We have securely received your
        payment and will process your shipment shortly.
      </p>

      <Link to="/shop" className="btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
