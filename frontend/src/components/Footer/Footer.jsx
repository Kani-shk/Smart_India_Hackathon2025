import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
          <img src="../src/assets/FooterImage.png" height="90" width="150" href="/"/>
            {/* <h3>SharePlate</h3> */}
            <p>
              Empowering NGOs to manage food distribution events and build
              community resilience through emergency preparedness. Together, we
              can create sustainable food systems and disaster-ready
              communities.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                Facebook
              </a>
              <a href="#" className="social-link">
                Twitter
              </a>
              <a href="#" className="social-link">
                Instagram
              </a>
              <a href="#" className="social-link">
                LinkedIn
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="/events">Events</a>
              </li>
              <li>
                <a href="/contribute_food">Donate Food</a>
              </li>
              <li>
                <a href="/#aboutus">About Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Get Involved</h4>
            <ul>
              <li>
                <a href="#create-event">Create Event</a>
              </li>
              <li>
                <a href="#partner">Partner With Us</a>
              </li>
              <li>
                <a href="#volunteer">Volunteer</a>
              </li>
              <li>
                <a href="#ngo-register">NGO Registration</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📧 info@foodshare.org</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 123 Community St, City, State 12345</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 FoodShare. All rights reserved.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
