import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Redirect if not authenticated
  if (!token) {
    return <Navigate to="/login-farmer" replace />;
  }

  return children; // Render children components if authenticated
};

export default PrivateRoute;
