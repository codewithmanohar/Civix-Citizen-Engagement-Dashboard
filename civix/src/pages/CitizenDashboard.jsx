import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api"; 
import { getAllPetitions } from "../lib/petitionService"; 
import PetitionCard from "../components/PetitionCard";
import DotsLoader from "../components/Loaders/DotsLoader";
import Loading from "../components/Loaders/Loading";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "User",
    role: localStorage.getItem("userRole") || "citizen",
    location: localStorage.getItem("location") || "Unknown",
  });

  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false); // modal visibility

  const userId = localStorage.getItem("userId");

  // --- Fetch Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      if (!userId || !token) return;

      try {
        const res = await api.get(`/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: res.data.name,
          role: res.data.role,
          location: res.data.location || "Unknown",
        });
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("userRole", res.data.role);
        localStorage.setItem("location", res.data.location || "Unknown");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // --- Fetch Petitions ---
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const data = await getAllPetitions();
        setPetitions(data);
      } catch (err) {
        console.error("Failed to load petitions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetitions();
  }, []);

  // --- Sign Out ---
  const handleSignout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- Back Button Pop-up ---
  useEffect(() => {
    const handleBack = (event) => {
      event.preventDefault();
      setShowConfirm(true);
      window.history.pushState(null, "", window.location.pathname); // stay on page
    };

    window.history.pushState(null, "", window.location.pathname); // push initial state
    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  // --- Derived Stats ---
  const myPetitions = petitions.filter(p => p.createdBy?._id === userId);
  const mySuccessfulPetitions = petitions.filter(
    (p) => p.status === "Resolved" && p.createdBy?._id === userId
  );

  const normalize = (str) => (str || "").trim().toLowerCase();

  const activePetitions = petitions.filter(p => {
    const petitionLocation = (p.location || "").toLowerCase().trim();
    const userLoc = (user.location || "").toLowerCase().trim();
    const matchesLocation = petitionLocation.includes(userLoc);
    const matchesCategory =
      selectedCategory === "All Categories"
        ? true
        : normalize(p.category) === normalize(selectedCategory);
    const matchesStatus = normalize(p.status) === "active";
    return matchesLocation && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col p-6 bg-blue-50 min-h-screen">
      {/* Welcome Section */}
      <section className="bg-white p-6 rounded-lg shadow mb-6 text-blue-600">
        <h2 className="text-2xl font-semibold">Welcome back, {user.name}!</h2>
        <p className="mt-2 text-blue-600">
          See what’s happening in your community and make your voice heard.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-5 bg-white rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold text-blue-700">My Petitions</h4>
          {loading ? (
            <DotsLoader />
          ) : (
            <div>
              <p className="text-3xl font-bold text-blue-700 mt-2">{myPetitions.length}</p>
              <p className="text-sm text-blue-600">petitions</p>
            </div>
          )}
        </div>
        <div className="p-5 bg-white rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold text-blue-700">Successful Petitions</h4>
          {loading ? (
            <DotsLoader />
          ) : (
            <p className="text-3xl font-bold text-green-600 mt-2">{mySuccessfulPetitions.length}</p>
          )}
          <p className="text-sm text-blue-600">petitions</p>
        </div>
      </section>

      {/* Active Petitions */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-blue-900">Active Petitions Near You</h3>
        <p className="text-sm text-blue-700 mt-1 mb-4">
          Showing for: <span className="font-medium text-blue-900">{user.location}</span>
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All Categories","Environment","Infrastructure","Education","Public Safety","Transportation"].map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-700 text-blue-50"
                  : "bg-blue-200 text-blue-800 hover:bg-blue-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : activePetitions.length === 0 ? (
          <div className="text-center text-blue-700 py-10">
            <p>No petitions found with the current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePetitions.map((petition) => (
              <PetitionCard
                key={petition._id}
                petition={petition}
                selectedTab="active"
                currentUser={user.name}
                mySignedPetitions={petitions.filter((p) =>
                  p.signatures?.some((s) => s?.userId === localStorage.getItem("userId"))
                )}
              />
            ))}
          </div>
        )}
      </section>

      {/* ------------------ SIGN OUT MODAL ------------------ */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-[400px] bg-white shadow-2xl border border-gray-200 rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-900 text-lg font-semibold mb-4 text-center">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignout}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
