import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <a href="/"><img src="../src/assets/SharePlateLogo.jpg" height="80" width="160" href="/"/></a>
        </div>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to={"/"}>
          <a href="#home" className="nav-link">
            Home
          </a>
          </Link>
          <Link to="/donation">
          <a href="#donate-food" className="nav-link donate-link">
            ❤️ Donate
          </a>
          </Link>
          <Link to="/events">
          <a href="#events" className="nav-link">
            Events
          </a>
          </Link>
          
          <Link to={"/contribute_food"}>
          <a href="#contribute" className="nav-link">
            Contribute Food
          </a>
          </Link>
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? "bar1" : ""}`}></span>
          <span className={`bar ${isMenuOpen ? "bar2" : ""}`}></span>
          <span className={`bar ${isMenuOpen ? "bar3" : ""}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
