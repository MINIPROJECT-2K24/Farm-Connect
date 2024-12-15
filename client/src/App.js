import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import Navigate from react-router-dom
import { useState, useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute"; // Assuming you have a PrivateRoute component
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CropSearch from "./pages/HomePage"; // Example page
import FarmerLogin from "./pages/FarmerLogin";
import BuyerLogin from "./pages/BuyerLogin";
import LandPage from "./pages/LandingPage";

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      {/* Only render Navbar if logged in and on private routes */}
      {token && (
        <Navbar role={role} /> // Pass role to Navbar to conditionally render Dashboard button
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandPage />} />
        <Route path="/login-farmer" element={<FarmerLogin />} />
        <Route path="/login-buyer" element={<BuyerLogin />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            role === "farmer" ? (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            ) : (
              <Navigate to="/" /> // Redirect non-farmers to home
            )
          }
        />
        <Route
          path="/crop-search"
          element={
            <PrivateRoute>
              <CropSearch />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
