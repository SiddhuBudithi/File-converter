import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Header.css";
import logo from "../../Assests/logo_trans1.png";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Twokey Logo" className="logo-image" />
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/tools">Tools</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About Us</Link>
        <Link to="/login">Login</Link>
        {/* <Link to="/signup">Signup</Link> */}
      </nav>
    </header>
  );
};

export default Header;
