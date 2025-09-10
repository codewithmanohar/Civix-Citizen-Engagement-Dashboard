// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/Forgotpassword";
import SetNewPassword from "./components/SetNewPassword";
import CitizenDashboard from "./components/CitizenDashboard";
import PetitionPage from "./components/PetitionPage";
import CreatePetition from "./components/CreatePetition";
import OfficialDashboard from "./components/OfficialDashboard";
import OfficialPendingPetitions from "./components/OfficialPendingPetitions";
import OfficialApprovedPetitions from "./components/OfficialApprovedPetitions";
import OfficialResolvedPetitions from "./components/OfficialResolvedPetitions";
import OfficialPetitionView from "./components/OfficialPetitionView";
import OfficialLayout from "./components/OfficialLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import petitionsData from "./components/petitionData";
import SignPetition from "./components/SignPetition";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ State for petitions and approvals
  const [approvedPetitions, setApprovedPetitions] = useState([]);
  const [petitions, setPetitions] = useState(petitionsData); // central petitions state

  const addToApproved = (petition) =>
    setApprovedPetitions([...approvedPetitions, petition]);

  // ✅ When a petition is signed
  const handleSignPetition = (id, signer) => {
    setPetitions((prev) =>
      prev.map((petition) =>
        petition.id === id
          ? {
              ...petition,
              signatures: petition.signatures + 1,
              signedBy: [...(petition.signedBy || []), signer],
            }
          : petition
      )
    );
  };

  const hideNavbarPrefixes = [
    "/login",
    "/register",
    "/forgot-password",
    "/set-new-password",
    "/dashboard/citizen",
    "/dashboard/official",
    "/petitions",
  ];
  const shouldHideNavbar = hideNavbarPrefixes.some((p) =>
    location.pathname.startsWith(p)
  );
  const hideFooterOnHome = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <div
        className={`flex-grow w-full ${
          isDashboard ? "" : "max-w-screen-xl mx-auto"
        }`}
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<Hero />} />
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />

          {/* Citizen */}
          <Route
            path="/dashboard/citizen"
            element={
              <ProtectedRoute allowedRole="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/citizen/petitions"
            element={
              <ProtectedRoute allowedRole="citizen">
                <PetitionPage
                  petitions={petitions}
                  setPetitions={setPetitions}
                  onSign={handleSignPetition}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/citizen/create-petition"
            element={
              <ProtectedRoute allowedRole="citizen">
                <CreatePetition setPetitions={setPetitions} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/citizen/sign/:id"
            element={
              <ProtectedRoute allowedRole="citizen">
                <SignPetition onSign={handleSignPetition} />
              </ProtectedRoute>
            }
          />

          {/* Official */}
          <Route
            path="/dashboard/official"
            element={
              <ProtectedRoute allowedRole="official">
                <OfficialLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OfficialDashboard />} />
            <Route
              path="petitions/pending"
              element={
                <OfficialPendingPetitions addToApproved={addToApproved} />
              }
            />
            <Route
              path="petitions/approved"
              element={
                <OfficialApprovedPetitions
                  approvedPetitions={approvedPetitions}
                />
              }
            />
            <Route
              path="petitions/resolved"
              element={<OfficialResolvedPetitions />}
            />
            <Route
              path="petitions/view/:id"
              element={<OfficialPetitionView />}
            />
            <Route
              path="create-petition"
              element={
                <ProtectedRoute allowedRole="official">
                  <CreatePetition />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
      {!hideFooterOnHome && <Footer />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

