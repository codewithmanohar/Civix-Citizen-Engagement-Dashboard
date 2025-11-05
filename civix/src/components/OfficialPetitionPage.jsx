import React, { useEffect, useState } from "react";
import OfficialPetitionCard from "../components/OfficialPetitionCard";
import { Routes, Route } from "react-router-dom";
import { getAllPetitions } from "../lib/petitionService";
import Loading from "../components/Loaders/Loading";
import ViewPetition from "../pages/ViewPetitions"; // 👈 official detailed view page

const OfficialPetitionPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Fetch all petitions for officials
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allData = await getAllPetitions();
        setPetitions(allData || []);
      } catch (err) {
        console.error("Failed to load petitions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Unique locations for filter
  const locations = [
    "All Locations",
    ...new Set(petitions.filter((p) => p && p.location).map((p) => p.location)),
  ];

  // Apply filters
  const filteredPetitions = petitions
    .filter((p) => p)
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
        <h1 className="text-blue-900 text-3xl font-bold mb-4">All Petitions</h1>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
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

      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <OfficialPetitionCard
                key={petition._id}
                petition={petition}
                role="official" // 👈 pass a prop so card hides "Sign Petition"
              />
            ))}
          </div>

          {/* Route for viewing petition details */}
          <Routes>
            <Route path="view/:id" element={<ViewPetition />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default OfficialPetitionPage;
