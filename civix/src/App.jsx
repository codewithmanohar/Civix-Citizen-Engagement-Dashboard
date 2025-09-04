/*import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import ForgotPassword from "./components/Forgotpassword.jsx";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import OfficialDashboard from "./components/OfficialDashboard.jsx";
import CitizenDashboard from "./components/CitizenDashboard.jsx";
import CreatePetition from "./components/CreatePetition.jsx";
import OtpForm from "./components/OtpForm.jsx";
import SetNewPassword from "./components/SetNewPassword.jsx";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer.jsx";
import PetitionPage from './components/PetitionPage';
import petitionData from './components/petitionData';

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("authToken");
    const currentPath = window.location.pathname;

    if (isLoggedIn && (currentPath === "/" || currentPath === "/login")) {
      if (role === "official") {
        navigate("/dashboard/official");
      } else {
        navigate("/dashboard/citizen");
      }
    }
  }, []);

  const isLoggedIn = localStorage.getItem("authToken");

  return (
    <div className="flex flex-col min-h-screen bg-brand-light font-sans">
      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto">
          <Navbar />

          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/login"
              element={
                <LoginForm
                  onForgotPassword={() => navigate("/forgot-password")}
                  onSwitchToRegister={() => navigate("/register")}
                />
              }
            />
            <Route path="/register" element={<RegisterForm />} />

            {//OTP + New Password Routes }
            <Route path="/set-new-password" element={<SetNewPassword />} />


            {/* Protected Dashboard Routes }
            <Route
              path="/dashboard/citizen"
              element={isLoggedIn ? <CitizenDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard/official"
              element={isLoggedIn ? <OfficialDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard/official/create-petition"
              element={isLoggedIn ? <CreatePetition /> : <Navigate to="/" />}
            />
             <Route path="/petitions" element={<PetitionPage />} />
          </Routes>

          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      </div>

      {location.pathname !== "/" && <Footer />}
    </div>
  );
}*/
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import PetitionPage from "./components/PetitionPage";
import CitizenDashboard from "./components/CitizenDashboard";
import OfficialDashboard from "./components/OfficialDashboard";
import CreatePetition from "./components/CreatePetition";
import Hero from "./components/Hero";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/Forgotpassword";
import SetNewPassword from "./components/SetNewPassword";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/CitizenDashboard";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbarPrefixes = ["/petitions", "/dashboard/citizen", "/dashboard/official","/dashboard"];
  const hideFooterPaths = ["/"]; // ✅ no footer on home page
  const shouldHideNavbar = hideNavbarPrefixes.some(prefix => location.pathname.startsWith(prefix));
  const isLoggedIn = true; 
  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditional Navbar */}
      {!shouldHideNavbar && <Navbar />}

      {/* Page Content */}
      <div className="flex-grow max-w-screen-xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/login"
            element={
              <LoginForm
                onForgotPassword={() => navigate("/forgot-password")}
                onSwitchToRegister={() => navigate("/register")}
              />
            }
          />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />

          {/* Dashboards */}
          <Route
            path="/dashboard/citizen"
            element={isLoggedIn ? <CitizenDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard/official"
            element={isLoggedIn ? <OfficialDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard/official/create-petition"
            element={isLoggedIn ? <CreatePetition /> : <Navigate to="/" />}
          />
          <Route path="/dashboard/*" element={<Dashboard />} />
              
          {/* Petitions */}
          <Route path="/petitions" element={<PetitionPage />} />
          <Route path="/dashboard/official/create-petition" element={<CreatePetition />} />
        </Routes>
      </div>

      {/* ✅ Footer everywhere except home */}
      {!hideFooterPaths.includes(location.pathname) && <Footer />}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
