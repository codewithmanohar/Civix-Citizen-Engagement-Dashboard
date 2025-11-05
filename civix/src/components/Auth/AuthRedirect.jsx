import { Navigate } from "react-router-dom";

export default function AuthRedirect({ children }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  if (token) {
    // already logged in → redirect based on role
    if (role === "citizen") {
      return <Navigate to="/dashboard/citizen" replace />;
    }
    if (role === "official") {
      return <Navigate to="/dashboard/official" replace />;
    }
  }

  // not logged in → show the page (home, login, etc.)
  return children;
}
