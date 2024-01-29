// UpdatePassword.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../axios/axiosConfig";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress from Material-UI
import "./updatePassword.scss";
import { NavigateBefore } from "@mui/icons-material";
import { logoutUser } from "../../actions/userActions";
import { Link, useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      window.location = "../";
    }
  }, [user]);

  const handleUpdatePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        toast.error("All fields are required");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        toast.error("New password and confirm new password must match");
        return;
      }

      setLoading(true);

      // Send request to update password
      const response = await axiosInstance.post("user/update-password", {
        old_password: currentPassword,
        password: newPassword,
      });

      if (response) {
        toast.success("Password updated successfully");
        localStorage.clear();
        dispatch(logoutUser());
        navigate("/login");
      }
    } catch (error) {
      toast.error("Password update failed. Please check your credentials.");
      console.error("Password update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleUpdatePassword();
    }
  };

  return (
    <div className="update-password-container">
      <div className="update-password-form">
        <h1>Update Password</h1>

        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            className="form-control"
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter Your Current Password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter Your New Password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            className="form-control"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm Your New Password"
            disabled={loading}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleUpdatePassword}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
