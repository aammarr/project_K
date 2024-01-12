// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import "./header.scss"; // Import the SASS file
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../actions/userActions";
import { toast } from "react-toastify";

const Header = () => {
  const user = useSelector((state) => state.user.user);

  console.log(user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("logout");
    localStorage.clear();
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
  };
  return (
    <div className="header">
      <Link to="/" className="logo">
        Slideboom{" "}
      </Link>
      <div className="nav-links">
        <Link to="/premium-plans">Premium Plans</Link>
        {user ? (
          <Link to="#" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
