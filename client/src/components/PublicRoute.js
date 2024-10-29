import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />; // Redirect authenticated users to a private route
  }

  return children; // Render public component if not authenticated
};

export default PublicRoute;
