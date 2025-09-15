import React, { useEffect, useState } from "react";
import PetitionCard from "./PetitionCard";
import { useNavigate, Routes, Route } from "react-router-dom";
import SignPetition from "./SignPetition";
import { getAllPetitions } from "../lib/petitionService";

const PetitionPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const navigate = useNavigate();
  const currentUser = localStorage.getItem("name");

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

  const filteredPetitions = petitions.filter((p) => {
    const matchesTab =
      selectedTab === "all"
        ? true
        : selectedTab === "mine"
        ? p.createdBy?.name === currentUser
        : p.signatures?.some((s) => s.user.name === currentUser);

    const matchesLocation =
      selectedLocation === "All Locations" ? true : p.location === selectedLocation;

    const matchesStatus = selectedStatus === "All" ? true : p.status === selectedStatus;

    const matchesCategory =
      selectedCategory === "All Categories" ? true : p.category === selectedCategory;

    return matchesTab && matchesLocation && matchesStatus && matchesCategory;
  });

  if (loading) return <div className="p-6">Loading petitions...</div>;

  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">
      
      {/* Fixed Header */}
      <div className="bg-blue-50 px-6 py-4 border-b shadow flex-shrink-0">

        <h1 class="text-blue-900 text-3xl font-bold mb-4">Petitions</h1>


        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {["all", "mine", "signed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab === "all"
                  ? "All Petitions"
                  : tab === "mine"
                  ? "My Petitions"
                  : "Signed by Me"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 ml-auto flex-wrap">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Locations</option>
              <option>AP</option>
              <option>Los Angeles</option>
              <option>New York</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Active</option>
              <option>Closed</option>
              <option>Resolved</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Categories</option>
              <option>Environment</option>
              <option>Education</option>
              <option>Healthcare</option>
              <option>Infrastructure</option>
              <option>Public Safety</option>
              <option>Transportation</option>
              <option>Housing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable Petition Cards */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPetitions.map((petition) => (
            <PetitionCard key={petition._id} petition={petition} />
          ))}
        </div>

        <Routes>
          <Route path="sign/:id" element={<SignPetition onSigned={() => {}} />} />
        </Routes>
      </div>

      {/* Fixed Footer CTA */}
      <div className="p-6 bg-gray-50 border-t shadow flex-shrink-0">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Have an issue that needs attention?
          </h2>
          <p className="text-gray-600 mt-2">
            Create a petition to gather support and bring visibility to the issues
            that matter most in your community.
          </p>
          <button
            onClick={() => navigate("/dashboard/citizen/create-petition")}
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Create a Petition
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetitionPage;
