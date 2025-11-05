import React, { useEffect, useState } from "react";
import PetitionCard from "../components/PetitionCard";
import { useNavigate, Routes, Route } from "react-router-dom";
import SignPetition from "./SignPetition";
import { getAllPetitions, getMySignedPetitions } from "../lib/petitionService";
import Loading from "../components/Loaders/Loading";

const PetitionPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [mySignedPetitions, setMySignedPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const navigate = useNavigate();
  const currentUser = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");
  // Unique locations
  const locations = [
    "All Locations",
    ...new Set(petitions.filter((p) => p && p.location).map((p) => p.location)),
  ];

  // Fetch petitions and signed petitions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const signedData = await getMySignedPetitions();
        setMySignedPetitions(signedData.petitions || []);

        if (selectedTab === "signed") {
          setPetitions(signedData.petitions || []);
        } else {
          const allData = await getAllPetitions();
          setPetitions(allData || []);
        }
      } catch (err) {
        console.error("Failed to load petitions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  // Handle petition signed event
  const handlePetitionSigned = (petitionId) => {
    // Update petitions list signature count
    setPetitions((prev) =>
      prev.map((p) =>
        p._id === petitionId
          ? { ...p, signatureCount: (p.signatureCount || 0) + 1 }
          : p
      )
    );
  
    // Move petition to "Signed by Me"
    const signedPetition = petitions.find((p) => p._id === petitionId);
    if (signedPetition && !mySignedPetitions.some((p) => p._id === petitionId)) {
      setMySignedPetitions((prev) => [...prev, signedPetition]);
    }
  };

  // Filtering petitions
  const filteredPetitions = petitions
    .filter((p) => p)
    .filter((p) => selectedTab !== "mine" || p.createdBy?._id === userId)
    .filter(
      (p) =>
        (selectedLocation === "All Locations" || p.location === selectedLocation) &&
        (selectedStatus === "All" || p.status === selectedStatus) &&
        (selectedCategory === "All Categories" || p.category === selectedCategory)
    );

  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">
      {/* Header */}
      <div className="bg-blue-50 px-6 py-4 border-b shadow flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-blue-900 text-3xl font-bold mb-4">Petitions</h1>
          <button
            onClick={() => navigate("/dashboard/citizen/create-petition")}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Create a Petition
          </button>
        </div>

        {/* Tabs & Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4">
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

          <div className="flex gap-3 ml-auto flex-wrap">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Active</option>
              <option>Under Review</option>
              <option>Resolved</option>
              <option>Rejected</option>
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

      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <PetitionCard
                key={petition._id}
                petition={petition}
                selectedTab={selectedTab}
                currentUser={currentUser}
                mySignedPetitions={mySignedPetitions}
              />
            ))}
          </div>

          {/* Nested route for signing */}
          <Routes>
            <Route
              path="sign/:id"
              element={<SignPetition onSigned={handlePetitionSigned} />}
            />
          </Routes>
        </div>
      )}

      {/* Footer */}
      {/* <div className="p-6 bg-gray-50 border-t shadow flex-shrink-0">
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
      </div> */}
    </div>
  );
};

export default PetitionPage;
