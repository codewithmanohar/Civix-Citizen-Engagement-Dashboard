import { Navigate } from "react-router-dom";
import isTokenExpired from "./Auth/IsTokenExpried";


export default function ProtectedRoute({ children, allowedRole }) {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

 
  if (!authToken) return <Navigate to="/login" replace />;


  if (isTokenExpired(authToken)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  
  return children;
}
