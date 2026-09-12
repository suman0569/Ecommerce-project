import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const { user } = useContext(AuthContext);

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [paymentMethod, setPaymentMethod] =
    useState("razorpay");


  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });


  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.qty,
    0
  );


  // =====================================================
  // RAZORPAY
  // =====================================================

  const handleRazorpayPayment = async () => {
    try {

      const orderRes = await fetch(
        "/api/payment/order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: totalPrice,
          }),
        }
      );


      const orderData =
        await orderRes.json();


      if (!orderRes.ok) {

        const fallback = window.confirm(
          "Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?"
        );

        if (fallback) {
          return bypassPayment();
        }

        return alert(
          "Payment failed to initialize"
        );
      }


      const options = {

        key:
          import.meta.env.VITE_RAZORPAY_KEY_ID ||
          "rzp_test_dummykey123",

        amount: orderData.amount,

        currency: orderData.currency,

        name: "Baggage",

        description: "Baggage Order",

        order_id: orderData.id,


        handler: async function (response) {

          const verifyRes =
            await fetch(
              "/api/payment/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  response
                ),
              }
            );


          if (!verifyRes.ok) {

            return alert(
              "Payment verification failed"
            );
          }


          const saveOrderRes =
            await fetch(
              "/api/orders",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${user.token}`,
                },

                body: JSON.stringify({
                  items: cartItems,

                  totalAmount:
                    totalPrice,

                  address,

                  paymentId:
                    response.razorpay_payment_id,

                  paymentMethod:
                    "Razorpay",

                  paymentStatus:
                    "Paid",
                }),
              }
            );


          if (saveOrderRes.ok) {

            dispatch(clearCart());

            navigate("/ordersuccess");

          } else {

            alert(
              "Order saving failed"
            );
          }
        },


        prefill: {
          name: address.fullName,

          email: user?.email,

          contact: "9999999999",
        },


        theme: {
          color: "#f97316",
        },
      };


      const rzp1 =
        new window.Razorpay(options);

      rzp1.open();

    } catch (error) {

      console.error(
        "Razorpay error:",
        error
      );
    }
  };


  // =====================================================
  // ESEWA
  // =====================================================

  const handleEsewaPayment = async () => {
    try {

      const response =
        await fetch(
          "/api/payment/esewa/initiate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${user.token}`,
            },

            body: JSON.stringify({

              items: cartItems,

              totalAmount:
                totalPrice,

              address,

            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Unable to initialize eSewa payment"
        );

        return;
      }


      // Create an HTML form
      // and submit it to eSewa.

      const form =
        document.createElement("form");

      form.method = "POST";

      form.action =
        data.paymentUrl;


      Object.entries(
        data.paymentData
      ).forEach(
        ([key, value]) => {

          const input =
            document.createElement(
              "input"
            );

          input.type = "hidden";

          input.name = key;

          input.value = value;

          form.appendChild(input);
        }
      );


      document.body.appendChild(form);

      form.submit();

    } catch (error) {

      console.error(
        "eSewa error:",
        error
      );

      alert(
        "Unable to initialize eSewa payment"
      );
    }
  };


  // =====================================================
  // BYPASS PAYMENT
  // =====================================================

  const bypassPayment = async () => {

    const saveOrderRes =
      await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${user.token}`,
          },

          body: JSON.stringify({

            items: cartItems,

            totalAmount:
              totalPrice,

            address,

            paymentId:
              "bypass_txn_" +
              Date.now(),

            paymentMethod:
              "Bypass",

            paymentStatus:
              "Paid",
          }),
        }
      );


    if (saveOrderRes.ok) {

      dispatch(clearCart());

      navigate("/ordersuccess");
    }
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {

    e.preventDefault();


    if (!user) {

      alert(
        "Please login first"
      );

      navigate("/login");

      return;
    }


    if (cartItems.length === 0) {

      alert(
        "Your cart is empty"
      );

      return;
    }


    if (
      paymentMethod ===
      "razorpay"
    ) {

      handleRazorpayPayment();

    } else if (
      paymentMethod ===
      "esewa"
    ) {

      handleEsewaPayment();
    }
  };


  return (

    <div className="checkout-container">

      <h2>Checkout</h2>


      <div className="checkout-content">

        <form
          onSubmit={handleSubmit}
          className="shipping-form"
        >

          <h3>
            Shipping Address
          </h3>


          <input
            type="text"
            placeholder="Full Name"
            required
            value={
              address.fullName
            }
            onChange={(e) =>
              setAddress({
                ...address,
                fullName:
                  e.target.value,
              })
            }
          />


          <input
            type="text"
            placeholder="Street"
            required
            value={
              address.street
            }
            onChange={(e) =>
              setAddress({
                ...address,
                street:
                  e.target.value,
              })
            }
          />


          <input
            type="text"
            placeholder="City"
            required
            value={
              address.city
            }
            onChange={(e) =>
              setAddress({
                ...address,
                city:
                  e.target.value,
              })
            }
          />


          <input
            type="text"
            placeholder="Postal Code"
            required
            value={
              address.postalCode
            }
            onChange={(e) =>
              setAddress({
                ...address,
                postalCode:
                  e.target.value,
              })
            }
          />


          <input
            type="text"
            placeholder="Country"
            required
            value={
              address.country
            }
            onChange={(e) =>
              setAddress({
                ...address,
                country:
                  e.target.value,
              })
            }
          />


          {/* =========================================
              PAYMENT METHOD
          ========================================= */}

          <div
            className="payment-method"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >

            <h3>
              Payment Method
            </h3>


            <label
              style={{
                display: "block",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >

              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={
                  paymentMethod ===
                  "razorpay"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              {" "}Razorpay
            </label>


            <label
              style={{
                display: "block",
                cursor: "pointer",
              }}
            >

              <input
                type="radio"
                name="paymentMethod"
                value="esewa"
                checked={
                  paymentMethod ===
                  "esewa"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              {" "}eSewa
            </label>

          </div>


          {/* =========================================
              SUMMARY
          ========================================= */}

          <div className="checkout-summary">

            <h4>
              Total to Pay: ₹
              {totalPrice.toFixed(2)}
            </h4>


            <button
              type="submit"
              className="btn"
            >
              {paymentMethod ===
              "esewa"
                ? "Pay with eSewa"
                : "Pay with Razorpay"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default Checkout;