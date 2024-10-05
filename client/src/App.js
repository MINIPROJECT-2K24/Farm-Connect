import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FarmerRegister from "./pages/FarmerRegister";
import BuyerRegister from "./pages/BuyerRegister";
import FarmerLogin from "./pages/FarmerLogin";
import BuyerLogin from "./pages/BuyerLogin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-farmer" element={<FarmerRegister />} />
        <Route path="/register-buyer" element={<BuyerRegister />} />
        <Route path="/login-farmer" element={<FarmerLogin />} />
        <Route path="/login-buyer" element={<BuyerLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
