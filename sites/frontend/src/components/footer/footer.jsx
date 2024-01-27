// src/components/Footer.js
import React from "react";
import "./footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <p>&copy; {currentYear} Slidebloom. All rights reserved.</p>
            <p>
              Designed and developed by{" "}
              <a href="https://adateck.com" style={{ textDecoration: "none" }}>
                Adateck
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
