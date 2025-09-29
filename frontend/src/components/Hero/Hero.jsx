import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      {/* Background Video */}
      <video
        className="hero-bg-video"
        autoPlay
        loop
        muted
        playsInline
        src="/videos/mainpage2.mp4" 
      />
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Make a Difference with{" "}
            <span className="highlight">Your Donation</span>
          </h1>
          <p className="hero-description">
            Join us in creating impactful events for our community. 20% of every
            donation is reserved as an emergency fund, so your support always
            goes further.
          </p>
          <div className="hero-buttons">
            <a href="/donation" className="btn-primary">Donate Now</a>
          </div>
        </div>
      </div>
      <div className="floating-shapes">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
};

export default Hero;
