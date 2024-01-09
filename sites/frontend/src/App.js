// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home"; // Create this component
import HeaderFooter from "./components/header-footer/hf";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HeaderFooter />}>
        <Route index element={<Home />} />
      </Route>

      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
