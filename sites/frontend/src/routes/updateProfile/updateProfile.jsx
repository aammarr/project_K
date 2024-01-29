// UpdateProfile.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./updateProfile.scss";
import axiosInstance from "../../axios/axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import { setUser } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const user = useSelector((state) => state.user.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      window.location = "../";
    }
  }, [user]);
  const navigate = useNavigate();
  const handleUpdateProfile = async () => {
    try {
      if (!firstName || !lastName || !phone) {
        toast.error("All fields are required");
        return;
      }

      setLoading(true);

      // Send request to update profile
      const response = await axiosInstance.put("user", {
        userId: user.userId,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      if (response) {
        const userData = response?.data?.data;
        dispatch(setUser(userData));
        toast.success("Profile updated successfully");

        navigate("../");
      }
    } catch (error) {
      toast.error("Profile update failed. Please check your credentials.");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleUpdateProfile();
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user?.first_name);
      setLastName(user?.last_name); // Set last name
      setPhone(user?.phone); // Set phone
    }
  }, [user]);

  return (
    <div className="update-profile-container">
      <div className="update-profile-form">
        <h1>Update Profile</h1>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            value={firstName}
            className="form-control"
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter Your First Name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            value={lastName}
            className="form-control"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Your Last Name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            value={phone}
            className="form-control"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Your Phone Number"
            disabled={loading}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Update Profile"
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
