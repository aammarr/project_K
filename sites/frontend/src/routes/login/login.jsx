// Login.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../../actions/userActions";
import "./login.scss"; // Import your Sass file
import axiosInstance from "../../axios/axiosConfig";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress from Material-UI

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    console.log(user);
    if (user) {
      window.location = "../";
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }

      setLoading(true); // Start loading

      const response = await axiosInstance.post("user/login", {
        email,
        password,
      });

      const userData = response?.data?.data; // Adjust this based on your API response structure
      localStorage.setItem("x-auth-token", userData?.token);
      dispatch(setUser(userData));
      toast.success("Login successful");
      window.location = "../";
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Stop loading, whether successful or not
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      {!user && (
        <div className="login-container">
          {/* Left container with background image */}
          <div className="left-container"></div>

          {/* Right container with login form */}
          <div className="right-container">
            <h1>Slideboom</h1>
            <h2>Login</h2>

            {/* Login form */}
            <div className="form-main">
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  disabled={loading} // Disable input when loading
                  onKeyPress={handleKeyPress} // Handle Enter key press
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  disabled={loading} // Disable input when loading
                  onKeyPress={handleKeyPress} // Handle Enter key press
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Login"
                )}
              </button>

              <p>
                Don't have an account? <Link to="/sign-up">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
