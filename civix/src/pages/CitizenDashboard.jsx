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
  const [nearbyPetition, setNearByPetition] = useState([]);
  const [loading, setLoading] = useState(true);

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
        
        const response = await api.get(`petition/filter?location=${user.location}`);
        setNearByPetition(response.data);

      } catch (err) {
        console.error("Failed to load petitions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetitions();
  }, []);

  const handleSignout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- Derived Stats ---
  const myPetitions = petitions.filter(p => p.createdBy?.name === user.name);
  const successfulPetitions = petitions.filter(
    p => p.createdBy?.name === user.name && (p.status === "Resolved" || p.status === "Under Review" || p.status === "Approved")
  );


  // --- Normalize helper for categories ---
  const normalize = (str) => (str || "").trim().toLowerCase();

  // --- Filter active petitions near user + category ---
  // const activePetitions = petitions.filter(p => {
  //   const petitionLocation = (p.location || "").toLowerCase().trim();
  //   const userLoc = (user.location || "").toLowerCase().trim();
  //   const matchesLocation = petitionLocation.includes(userLoc); // partial match
  //   const matchesCategory =
  //     selectedCategory === "All Categories"
  //       ? true
  //       : normalize(p.category) === normalize(selectedCategory);
  //   return matchesLocation && matchesCategory;
  // });

  const activePetitions = petitions.filter(p => {
    const petitionLocation = (p.location || "").toLowerCase().trim();
    const userLoc = (user.location || "").toLowerCase().trim();
    const matchesLocation = petitionLocation.includes(userLoc);

    const matchesCategory =
      selectedCategory === "All Categories"
        ? true
        : normalize(p.category) === normalize(selectedCategory);

    const isActive = ["Open", "Pending"].includes(p.status); // <-- important

    return matchesLocation && matchesCategory && isActive;
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
          {
            loading
              ? <DotsLoader />
              : <div>
                <p className="text-3xl font-bold text-blue-700 mt-2">{myPetitions.length}</p>
                <p className="text-sm text-blue-600">petitions</p>
              </div>
          }

        </div>
        <div className="p-5 bg-white rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold text-blue-700">Successful Petitions</h4>
          {
            loading 
              ? <DotsLoader /> 
              : <p className="text-3xl font-bold text-green-600 mt-2">{successfulPetitions.length}</p>
          }
          <p className="text-sm text-blue-600">or under review</p>
        </div>
      </section>

      {/* Active Petitions Near You */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-blue-900">
          Active Petitions Near You
        </h3>
        <p className="text-sm text-blue-700 mt-1 mb-4">
          Showing for: <span className="font-medium text-blue-900">{user.location}</span>
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "All Categories",
            "Environment",
            "Infrastructure",
            "Education",
            "Public Safety",
            "Transportation",
          ].map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                  ? "bg-blue-700 text-blue-50"
                  : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Petition List */}
        {loading ? (
          <Loading />
        ) : (() => {
          const currentUserName = user.name || localStorage.getItem("name") || "";
          const currentUserId = localStorage.getItem("userId") || "";

          const filteredPetitions = nearbyPetition.filter((p) => {
            // Category filter
            const matchesCategory = selectedCategory === "All Categories"
              ? true
              : (p.category || "").toLowerCase().trim() === selectedCategory.toLowerCase().trim();

            // Owner filter - exclude current user's petitions
            const petitionCreatorName = (p.createdBy?.name || "").toLowerCase().trim();
            const petitionCreatorId = p.createdBy?._id || p.createdBy?.id || "";

            const isOwnPetition =
              petitionCreatorName === currentUserName.toLowerCase().trim() ||
              (currentUserId && petitionCreatorId && petitionCreatorId === currentUserId);



            return matchesCategory && !isOwnPetition;
          });

          // Filter to show only petitions from other users
          const finalFilteredPetitions = nearbyPetition.filter(p => {
            const matchesCategory = selectedCategory === "All Categories" ||
              (p.category || "").toLowerCase().trim() === selectedCategory.toLowerCase().trim();

            // Only show petitions NOT created by current user
            const creatorName = (p.createdBy?.name || "").trim();
            const currentName = (currentUserName || "").trim();
            const isFromOtherUser = creatorName !== currentName && creatorName !== "";

            return matchesCategory && isFromOtherUser;
          });
        
          if (finalFilteredPetitions.length === 0) {
            return (
              <div className="text-center text-blue-700 py-10">
                <p>
                  No petitions found in{" "}
                  <span className="font-semibold">{selectedCategory}</span> from other users.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {finalFilteredPetitions.map((petition) => (
                <PetitionCard key={petition._id} petition={petition} />
              ))}
            </div>
          );
        })()}

      </section>
    </div>
  );
};

export default CitizenDashboard;
