// HeaderFooter.jsx

import "./hf.scss";
import Header from "../header/header";
import { Outlet } from "react-router-dom";
import Footer from "../footer/footer";

const HeaderFooter = () => {
  return (
    <div className="header-footer-container">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default HeaderFooter;
