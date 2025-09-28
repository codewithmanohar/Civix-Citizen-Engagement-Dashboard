import React, { useEffect, useState } from "react";
import PetitionCard from "../components/PetitionCard";
import { useNavigate, Routes, Route } from "react-router-dom";
import SignPetition from "./SignPetition";
import { getAllPetitions, getMySignedPetitions } from "../lib/petitionService";
import Loading from "../components/Loaders/Loading";

const PetitionPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  // Get unique locations from petitions
  // Get unique locations safely
  const locations = [
    "All Locations",
    ...new Set(
      petitions
        .filter(p => p && p.location) // ✅ remove null/undefined
        .map(p => p.location)
    )
  ];


  const navigate = useNavigate();
  const currentUser = localStorage.getItem("name");

  useEffect(() => {
    const fetchPetitions = async () => {
      setLoading(true);
      try {
        if (selectedTab === "signed") {
          // Fetch only signed petitions from backend
          const data = await getMySignedPetitions();
          setPetitions(data.petitions || []); // ✅ use the petitions array
        } else {
          // Fetch all petitions
          const data = await getAllPetitions();
          setPetitions(data);
        }
      } catch (err) {
        console.error("Failed to load petitions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetitions();
  }, [selectedTab]);

  // Filter petitions for "mine" tab and filters
  const filteredPetitions = petitions
    .filter((p) => p) // ✅ remove null
    .filter((p) => selectedTab !== "mine" || p.createdBy?.name === currentUser)
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
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {["all", "mine", "signed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${selectedTab === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {tab === "all" ? "All Petitions" : tab === "mine" ? "My Petitions" : "Signed by Me"}
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

      {
        loading
          ? <Loading />
          : <div>
            {/* Petition Cards */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPetitions.map((petition) => (
                  <PetitionCard key={petition._id} petition={petition} />
                ))}
              </div>

              <Routes>
                <Route path="sign/:id" element={<SignPetition onSigned={() => { }} />} />
              </Routes>
            </div>

           
          </div>
      }

    </div>
  );
};

export default PetitionPage;
