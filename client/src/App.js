import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CropSearch from "./pages/HomePage";
import FarmerLogin from "./pages/FarmerLogin";
import BuyerLogin from "./pages/BuyerLogin";
import LandPage from "./pages/LandingPage";
import FarmerDetails from "./pages/FarmerDetails";
import Weather from "./pages/weather";
import FarmerRegister from "./pages/FarmerRegister";
import BuyerRegister from "./pages/BuyerRegister";
import { AiCropAdvisor } from "./pages/AiTranslate";
import Npkmodel from "./pages/Npkmodel";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const role = localStorage.getItem("role");

  return (
    <Router>
      {isLoggedIn && <Navbar role={role} setIsLoggedIn={setIsLoggedIn} />}

      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route
          path="/login-farmer"
          element={<FarmerLogin setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/login-buyer"
          element={<BuyerLogin setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register-farmer" element={<FarmerRegister />} />
        <Route path="/register-buyer" element={<BuyerRegister />} />
        <Route path="/farmer-details" element={<FarmerDetails />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/npk-model" element={<Npkmodel/>}/>
        <Route
          path="/dashboard"
          element={
            role === "farmer" ? (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/cropanalyze"
          element={
            role === "farmer" ? (
              <PrivateRoute>
                <AiCropAdvisor />
              </PrivateRoute>
            ) : (
              <Navigate to="/" />
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
