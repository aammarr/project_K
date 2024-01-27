// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home"; // Create this component
import HeaderFooter from "./components/header-footer/hf";
import Login from "./routes/login/login";
import Signup from "./routes/signup/signup";
import TemplateDetails from "./routes/templateDetails/templateDetails";
import PremiumPlans from "./routes/premiumPlans/premiumPlans";
import UpdatePassword from "./routes/updatePassword/updatePassword";
import UpdateProfile from "./routes/updateProfile/updateProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HeaderFooter />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/template-details" element={<TemplateDetails />} />
        <Route path="/premium-plans" element={<PremiumPlans />} />{" "}
        <Route path="/update-password" element={<UpdatePassword />} />{" "}
        <Route path="/update-profile" element={<UpdateProfile />} />
      </Route>

      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
