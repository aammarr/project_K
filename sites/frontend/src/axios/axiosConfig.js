import axios from "axios";

// Create an instance of axios with common configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Set your base URL here
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("x-auth-token"),
  },
});

export default axiosInstance;
