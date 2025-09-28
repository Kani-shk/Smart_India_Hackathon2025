
import React from "react";
import "./Donate.css";
import qrImage from "../../assets/Kanishk QR.jpeg";

const Donate = () => (
  <section className="donate-section">
    <h2 className="donate-title">Support Us With Your Donation</h2>
    <p className="donate-desc">
      Scan the QR code below to make your secure donation and join our mission of positive change!
    </p>

    <div className="donate-qr">
      <img src={qrImage} alt="Donate QR Code" style={{ maxWidth: "300px", width: "100%", height: "auto" }} />
    </div>

    <div className="fund-allocation">
      <h3 className="fund-title">How Your Donation Makes a Difference</h3>
      
      <div className="fund-grid">
        <div className="fund-item emergency">
          <div className="fund-percentage">20%</div>
          <div className="fund-name">Emergency Relief Fund</div>
          <div className="fund-description">Reserved for disaster response, crisis intervention, and urgent humanitarian aid</div>
        </div>

        <div className="fund-item programs">
          <div className="fund-percentage">70%</div>
          <div className="fund-name">Food Distribution Events</div>
          <div className="fund-description">Creating events where we distribute food, rent venues, prepare meals for many people, and pay workers</div>
        </div>

        <div className="fund-item operations">
          <div className="fund-percentage">10%</div>
          <div className="fund-name">Operations</div>
          <div className="fund-description">Running website, administrative costs, and organizational management</div>
        </div>
      </div>
    </div>
  </section>
);

export default Donate;