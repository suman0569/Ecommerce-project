import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div>
      <h2>Payment Failed</h2>

      <p>
        Your payment was not completed.
      </p>

      <Link to="/checkout">
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFailed;