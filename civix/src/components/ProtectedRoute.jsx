import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const authToken = localStorage.getItem("authToken");
  const userRole  = localStorage.getItem("userRole");

  // not logged in → send to login
  if (!authToken) return <Navigate to="/login" replace />;

  // wrong role → push home
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/" replace />;

  return children;
}
