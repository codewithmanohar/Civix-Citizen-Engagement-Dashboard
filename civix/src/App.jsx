// src/App.jsx
import React, { useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom"; // ✅ Added Navigate

// Components
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/Forgotpassword"; // ✅ fixed case
import SetNewPassword from "./components/SetNewPassword";
import CitizenDashboard from "./components/CitizenDashboard";
import PetitionPage from "./components/PetitionPage";
import CreatePetition from "./components/CreatePetition";
import OfficialDashboard from "./components/OfficialDashboard";
import OfficialActivePetitions from "./components/OfficialActivePetitions";
import OfficialUnderReviewPetitions from "./components/OfficialUnderReviewPetitions";
import OfficialResolvedPetitions from "./components/OfficialResolvedPetitions";
import OfficialPetitionView from "./components/OfficialPetitionView";
import OfficialLayout from "./components/OfficialLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import petitionsData from "./components/petitionData";
import SignPetition from "./components/SignPetition";
import Layout from "./components/Layout";
// Polls
import CivixPollsPage from "./components/Civixpollspage";   // ✅ fixed casing
import PollCreationPage from "./components/Pollscreation";  // ✅ fixed casing
import PollVotingPage from "./components/Pollsvotingpage";  // ✅ fixed casing

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewPetition from "./components/ViewPetitions";

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
    "/polls",
  ];
  const shouldHideNavbar = hideNavbarPrefixes.some((p) =>
    location.pathname.startsWith(p)
  );
  const hideFooterOnHome = location.pathname === "/" || location.pathname.startsWith("/dashboard/official") || location.pathname.startsWith("/dashboard/citizen");

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {!shouldHideNavbar && <Navbar />}
      <div
        className={`flex-grow w-full ${isDashboard ? "" : "max-w-screen-xl mx-auto"
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
            path="/dashboard/citizen/*"
            element={
              <ProtectedRoute allowedRole="citizen">
                <Layout>
                  <Routes>
                    <Route index element={<CitizenDashboard />} />
                    <Route
                      path="petitions"
                      element={
                        <PetitionPage
                          petitions={petitions}
                          setPetitions={setPetitions}
                          onSign={handleSignPetition}
                        />
                      }
                    />
                    <Route
                      path="create-petition"
                      element={<CreatePetition setPetitions={setPetitions} />}
                    />
                    <Route
                      path="sign/:id"
                      element={<SignPetition onSign={handleSignPetition} />}
                    />
                    <Route
                      path="view/:id"
                      element={<ViewPetition />}
                    />
                  </Routes>
                </Layout>
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
                <OfficialActivePetitions addToApproved={addToApproved} />
              }
            />
            <Route
              path="petitions/approved"
              element={
                <OfficialUnderReviewPetitions
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

          {/* Polls */}
          {/* Polls */}
          <Route element={<Layout />}>
            <Route path="/polls" element={<CivixPollsPage />} />
            <Route path="/polls/create" element={<PollCreationPage />} />
            <Route path="/polls/:id" element={<PollVotingPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!hideFooterOnHome && <Footer />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
