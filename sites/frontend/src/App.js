// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home"; // Create this component

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
      </Route>

      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
