import React from "react";
import './developer.css';
import profile from "../assets/profile.jpeg";
const Developer = () => {
  return (
    <section className="developer-page">
      <div className="developer-card">

        {/* Profile Image */}
        <div className="developer-image-section">
          <div className="image-glow">
            <img
              src={profile}
              alt="Developer"
              className="developer-image"
            />
          </div>

          <div className="available-badge">
            <span></span>
            Available for work
          </div>
        </div>

        {/* Developer Information */}
        <div className="developer-content">

          <p className="developer-label">
            ABOUT THE DEVELOPER
          </p>

          <h1>
            Hi, I'm <span>Suman Tharu</span>
          </h1>

          <h2>
            Full Stack Developer & E-Commerce Enthusiast
          </h2>

          <p className="developer-description">
            I'm a passionate web developer who loves building beautiful,
            responsive and user-friendly web applications. I created this
            e-commerce platform with a focus on simplicity, performance and
            an enjoyable shopping experience.
          </p>

          {/* Developer Details */}
          <div className="developer-info">

            <div className="info-item">
              <span className="info-icon">👨‍💻</span>
              <div>
                <small>Role</small>
                <strong>Full Stack Developer</strong>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <small>Location</small>
                <strong>Nepal</strong>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🎓</span>
              <div>
                <small>Experience</small>
                <strong>1+ Years</strong>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">💻</span>
              <div>
                <small>Specialization</small>
                <strong>Web & E-Commerce</strong>
              </div>
            </div>

          </div>

          {/* Skills */}
          <div className="skills">
            <span className="portfolio-button">React.js</span>
            <span className="portfolio-button">JavaScript</span>
            <span className="portfolio-button">HTML</span>
            <span className="portfolio-button">CSS</span>
            <span className="portfolio-button">Node.js</span>
            <span className="portfolio-button">MySQL</span>
          </div>

          {/* Buttons */}
          <div className="developer-buttons">

            <a href="/contact" className="contact-button">
              Contact Me
              <span>→</span>
            </a>

            <a href="https://tharusuman.onrender.com" className="portfolio-button">
              View Portfolio
            </a>

          </div>

          {/* Social Links */}
          <div className="social-links">
            <a href="https://github.com/suman0569" aria-label="GitHub">GH</a>
            <a href="https://linkedin.com/in/sumanchy" aria-label="LinkedIn">in</a>
            <a href="https://www.facebook.com/profile.php?id=61565102253755" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Developer;
