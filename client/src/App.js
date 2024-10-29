import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CropSearch from "./pages/HomePage";
import FarmerRegister from "./pages/FarmerRegister";
import BuyerRegister from "./pages/BuyerRegister";
import FarmerLogin from "./pages/FarmerLogin";
import BuyerLogin from "./pages/BuyerLogin";
import CropDetails from "./pages/CropDetails";
import LandPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; // New PublicRoute component
import Navbar from "./components/Navbar";
import FarmerDetails from './pages/FarmerDetails';
import Dashboard from './pages/Dashboard';
import MyPost from './pages/Mypost';

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={<LandPage />} 
        />
        <Route 
          path="/login-farmer" 
          element={
            <PublicRoute>
              <FarmerLogin />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register-farmer" 
          element={
            <PublicRoute>
              <FarmerRegister />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login-buyer" 
          element={
            <PublicRoute>
              <BuyerLogin />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register-buyer" 
          element={
            <PublicRoute>
              <BuyerRegister />
            </PublicRoute>
          } 
        />

        {/* Private Routes */}
        <Route
          path="/crop-search"
          element={
            <PrivateRoute>
              {token && <Navbar />} {/* Render Navbar if authenticated */}
              <CropSearch />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-crop"
          element={
            <PrivateRoute>
              {token && <Navbar />}
              <CropDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {token && <Navbar />} 
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/farmer-details"
          element={
            <PrivateRoute>
              {token && <Navbar />}
              <FarmerDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-posts"
          element={
            <PrivateRoute>
              {token && <Navbar />}
              <MyPost />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
