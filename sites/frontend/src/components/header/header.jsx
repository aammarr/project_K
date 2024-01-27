import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.scss"; // Import the SASS file
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../actions/userActions";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UpdateIcon from "@mui/icons-material/Update";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("logout");
    localStorage.clear();
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    setAnchorEl(null); // Close the menu after logout
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  console.log(user);

  return (
    <div className="header">
      <Link to="/" className="logo">
        Slidebloom{" "}
      </Link>
      <div className="nav-links">
        <Link to="/premium-plans" className="mr-3">
          Premium Plans
        </Link>

        {user ? (
          <>
            <IconButton
              aria-label="user-menu"
              onClick={handleMenuOpen}
              size="large"
              sx={{ color: "white", ml: 2 }}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <div style={{ padding: "10px 5px", marginLeft: "13px" }}>
                <strong>{user.first_name + " " + user.last_name} </strong>
              </div>
              <MenuItem onClick={() => navigate("/update-profile")}>
                <UpdateIcon style={{ marginRight: "10px" }} />
                <span>Update Profile</span>
              </MenuItem>
              <MenuItem onClick={() => navigate("/update-password")}>
                <LockIcon style={{ marginRight: "10px" }} />
                <span>Update Password</span>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon style={{ marginRight: "10px" }} />
                <span>Logout</span>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
