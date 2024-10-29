import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to landing page if not authenticated
  }

  return children; // Render the private component if authenticated
};

export default PrivateRoute;
