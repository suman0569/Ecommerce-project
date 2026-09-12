import React, { useState } from "react";
import "../styles/contact.css";
import "../styles/icon.css";

const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/email/send",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Message sent successfully. Thank you!");

        // Clear form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Error:", error);

      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      <section className="contact-section">

        <div className="contact-container">

          {/* LEFT SIDE */}

          <div className="contact-info">

            <span className="contact-small-title">
              GET IN TOUCH
            </span>

            <h2>We'd Love to Hear From You</h2>

            <p className="contact-description">
              Whether you have a question about our products, an order,
              or anything else, our team is ready to help.
            </p>


            {/* Email */}

            <div className="contact-item">

              <div className="contact-icon">
                📧
              </div>

              <div>
                <a href="mailto:chysuman709@gmail.com">
                  chysuman709@gmail.com
                </a>
              </div>

            </div>


            {/* Mobile */}

            <div className="contact-item">

              <div className="contact-icon">
                📱
              </div>

              <div>
                <a href="tel:+9779827034184">
                  9827034184
                </a>
              </div>

            </div>


            {/* Location */}

            <div className="contact-item">

              <div className="contact-icon">
                📍
              </div>

              <div>
                <p>Nepal</p>
              </div>

            </div>


            {/* Social Media */}

            <div className="connect-section">

              <h3>Connect With Us</h3>

              <div className="connect-links">

                <a
                  href="https://www.facebook.com/profile.php?id=61565102253755"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="connect-social connect-facebook"
                >
                  <span>f</span>
                  Facebook
                </a>


                <a
                  href="https://linkedin.com/in/sumanchy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="connect-social connect-linkedin"
                >
                  <span>in</span>
                  LinkedIn
                </a>


                <a
                  href="https://tiktok.com/@sumanchaudhary0136"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="connect-social connect-tiktok"
                >
                  <span>♪</span>
                  TikTok
                </a>


                <a
                  href="mailto:chysuman709@gmail.com"
                  className="connect-social connect-email"
                >
                  <span>✉</span>
                  Email
                </a>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="contact-form-container">

            <h2>Send Us a Message</h2>

            <p>
              Fill out the form below and we'll get back to you
              as soon as possible.
            </p>


            <form onSubmit={handleSubmit}>

              <div className="form-row">

                {/* NAME */}

                <div className="form-group">

                  <label>Your Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="form-group">

                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* SUBJECT */}

              <div className="form-group">

                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* MESSAGE */}

              <div className="form-group">

                <label>Message</label>

                <textarea
                  rows="6"
                  name="message"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="send-button"
                disabled={loading}
              >

                {loading ? "Loading..." : "Send Message"}

              </button>

            </form>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;