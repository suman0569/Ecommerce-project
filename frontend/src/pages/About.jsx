import React from 'react';
import "../styles/about.css";
import { Link, useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="about-page">

      <section>
        <div>
          <h1></h1>  
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">

          <div className="about-image">
            <div className="bag-icon">🛍️</div>
          </div>

          <div className="about-content">
            <span className="about-small-title">WHO WE ARE</span>

            <h2>Shopping Made Simple with Baggage</h2>

            <p>
              Welcome to <strong>Baggage</strong>, your modern online
              shopping platform designed to make your everyday shopping
              easier, faster, and more enjoyable.
            </p>

            <p>
              We bring together a wide range of products in one convenient
              place. From fashion and electronics to lifestyle products and
              everyday essentials, Baggage helps you discover what you need
              without the hassle.
            </p>

            <p>
              Our goal is simple — provide quality products, affordable
              prices, secure shopping, and reliable service to every customer.
            </p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-heading">
          <span>WHY CHOOSE US</span>
          <h2>Why Shop With Baggage?</h2>
          <p>
            We focus on providing a smooth and trustworthy shopping
            experience for our customers.
          </p>
        </div>

        <div className="features-container">

          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>
              Get your favorite products delivered to your doorstep quickly
              and safely.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Shopping</h3>
            <p>
              Your privacy and security are important to us. Shop with
              confidence.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>
              We aim to provide quality products at competitive and
              affordable prices.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Customer First</h3>
            <p>
              Our customers are at the heart of everything we do.
            </p>
          </div>

        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">

          <div className="mission-content">
            <span>OUR MISSION</span>

            <h2>Making Online Shopping Better</h2>

            <p>
              At Baggage, our mission is to create an online marketplace
              where customers can easily find products they love at prices
              they can afford.
            </p>

            <p>
              We continuously work to improve our platform, expand our
              product collection, and deliver an experience that keeps our
              customers coming back.
            </p>

            <button className="start-shopping-btn"
            onClick={()=> navigate("/shop")}
            >
              Start Shopping
            </button>
          </div>

        </div>
      </section>

      

    </div>
  );
};

export default About;