import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signUp.scss"; // Import your Sass file
import { useSelector } from "react-redux";
import axiosInstance from "../../axios/axiosConfig";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (user) {
      window.location = "/";
    }
  }, [user]);

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      if (
        !email ||
        !firstName ||
        !lastName ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        toast.error("All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Password and Confirm Password do not match");
        return;
      }

      setLoading(true);

      const response = await axiosInstance.post("user/register/user", {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        password,
      });

      toast.success(response?.data?.message);
      navigate("/login");
    } catch (error) {
      toast.error("Error creating account. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignup(event);
    }
  };

  return (
    <>
      {!user && (
        <div className="signup-container">
          {/* Left container with background image */}
          <div className="left-container-signup"></div>

          {/* Right container with signup form */}
          <div className="right-container-signup">
            <h1>Slideboom</h1>
            <h2>Sign Up</h2>

            {/* Signup form */}
            <form>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Email"
                />
              </div>

              <div className="name-group">
                <div className="form-group">
                  <input
                    type="text"
                    id="firstName"
                    className="form-control"
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="First Name"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="lastName"
                    className="form-control"
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Phone Number"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Password"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm Password"
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
