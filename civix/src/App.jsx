// src/App.jsx
import React, { useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Hero from "./components/Hero";
//import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/Forgotpassword";
import SetNewPassword from "./components/SetNewPassword";
import CitizenDashboard from "./pages/CitizenDashboard";
import PetitionPage from "./pages/PetitionPage";
import CreatePetition from "./components/CreatePetition";
import OfficialDashboard from "./pages/OfficialDashboard";
import OfficialActivePetitions from "./components/OfficialActivePetitions";
import OfficialUnderReviewPetitions from "./components/OfficialUnderReviewPetitions";
import OfficialResolvedPetitions from "./components/OfficialResolvedPetitions";
import OfficialPetitionView from "./components/OfficialPetitionView";
import OfficialLayout from "./components/Layouts/OfficialLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import petitionsData from "./components/petitionData";
import SignPetition from "./pages/SignPetition";
import Layout from "./components/Layouts/Layout";
import NotFound from "./pages/NotFoundPage";
import ViewPetition from "./pages/ViewPetitions";
import HelpSupport from "./pages/HelpSupport";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import CivixPollsPage from "./pages/Civixpollspage";
import PollCreationPage from "./components/Pollscreation";
import PollVotingPage from "./pages/Pollsvotingpage";
import Profile from "./pages/Profile";
import AuthRedirect from "./components/Auth/AuthRedirect";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [approvedPetitions, setApprovedPetitions] = useState([]);
  const [petitions, setPetitions] = useState(petitionsData);

  const addToApproved = (petition) =>
    setApprovedPetitions([...approvedPetitions, petition]);

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
  const hideFooterOnHome =
    location.pathname === "/" ||
    location.pathname.startsWith("/dashboard/official") ||
    location.pathname.startsWith("/dashboard/citizen") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/forgot-password");


  const isDashboard = location.pathname.startsWith("/dashboard");
  const isLogin = location.pathname.startsWith("/login");

  return (
    <div className="flex flex-col min-h-screen bg-blue-20">
      {location.pathname === "/" && (
      <nav className="flex justify-between items-center px-10 py-6 text-blue-900">
        <div className="text-3xl font-extrabold tracking-wide">CIVIX</div>
      </nav>
    )}
      <div
        className={`flex-grow w-full ${isDashboard || isLogin ? "" : "max-w-screen-xl mx-auto"
          }`}
      >
        <Routes>
          <Route path="/polls" element={<CivixPollsPage />} />
<Route path="/polls/create" element={<PollCreationPage />} />
<Route path="/polls/:id" element={<PollVotingPage />} />
          {/* Public with AuthRedirect */}
          <Route
            path="/"
            element={
              <AuthRedirect>
                <Hero />
              </AuthRedirect>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginForm
                  onForgotPassword={() => navigate("/forgot-password")}
                  onSwitchToRegister={() => navigate("/register")}
                />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <RegisterForm />
              </AuthRedirect>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRedirect>
                <ForgotPassword />
              </AuthRedirect>
            }
          />
          <Route
            path="/set-new-password"
            element={
              <AuthRedirect>
                <SetNewPassword />
              </AuthRedirect>
            }
          />

          {/* Citizen */}
          <Route
            path="/dashboard/citizen/*"
            element={
              <ProtectedRoute allowedRole="citizen">
                <Layout />
              </ProtectedRoute>
            }
          >
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
            <Route path="view/:id" element={<ViewPetition />} />
            <Route path="polls" element={<CivixPollsPage />} />
            <Route path="polls/create" element={<PollCreationPage />} />
            <Route path="polls/:id" element={<PollVotingPage />} />
             <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpSupport />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Official */}
          <Route
            path="/dashboard/official/*"
            element={
              <ProtectedRoute allowedRole="official">
                <OfficialLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OfficialDashboard />} />
            <Route
              path="petitions/pending"
              element={<OfficialActivePetitions addToApproved={addToApproved} />}
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
            <Route path="petitions/view/:id" element={<OfficialPetitionView />} />
            <Route path="create-petition" element={<CreatePetition />} />
            <Route path="polls" element={<CivixPollsPage />} />
            <Route path="polls/create" element={<PollCreationPage />} />
            <Route path="polls/:id" element={<PollVotingPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpSupport />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!hideFooterOnHome && <Footer />}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
