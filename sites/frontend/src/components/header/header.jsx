// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import "./header.scss"; // Import the SASS file

const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="logo">
        Slideboom{" "}
      </Link>
      <div className="nav-links">
        <Link to="/premium-plans">Premium Plans</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Header;
