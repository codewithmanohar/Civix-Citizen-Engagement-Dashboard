/*import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PetitionCard from "./PetitionCard";
import petitions from "./petitionData";
import { useNavigate } from "react-router-dom";

const PetitionPage = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const navigate = useNavigate();
  const currentUser = "204102002.sridhartamarap"; // Replace with actual user ID/email

  // Filtering petitions
  const filteredPetitions = petitions.filter((p) => {
    const matchesTab =
      selectedTab === "all"
        ? true
        : selectedTab === "mine"
        ? p.createdBy === currentUser
        : p.signedBy?.includes(currentUser);

    const matchesLocation =
      selectedLocation === "All Locations" ? true : p.location === selectedLocation;

    const matchesStatus = selectedStatus === "All" ? true : p.status === selectedStatus;

    const matchesCategory =
      selectedCategory === "All Categories" ? true : p.category === selectedCategory;

    return matchesTab && matchesLocation && matchesStatus && matchesCategory;
  });

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Sidebar *}
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content *}
      <div className="flex-1 flex flex-col p-6">
        {/* Header *}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Petitions</h1>
        </div>

        {/* Tabs + Filters *}
        <div className="flex flex-wrap justify-between items-center mb-8">
          {/* Tabs *}
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

          {/* Filters *}
          <div className="flex gap-3 ml-auto">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Locations</option>
              <option>San Diego</option>
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
              <option>Under Review</option>
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
         {/* Petitions Grid *}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredPetitions.map((petition) => (
            <PetitionCard key={petition.id} petition={petition} />
          ))}
          </div>
        
        {/* CTA Section *}
        <div className="mt-12 bg-gray-50 border rounded-lg p-6 text-center shadow-sm">
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

export default PetitionPage;*/

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PetitionCard from "./PetitionCard";
import { useNavigate, Routes, Route } from "react-router-dom";
import SignPetition from "./SignPetition";

const PetitionPage = ({ petitions, onSign, currentUser }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const navigate = useNavigate();

  // Filtering petitions
  const filteredPetitions = petitions.filter((p) => {
    const matchesTab =
      selectedTab === "all"
        ? true
        : selectedTab === "mine"
        ? p.createdBy === currentUser
        : p.signedBy?.includes(currentUser);

    const matchesLocation =
      selectedLocation === "All Locations" ? true : p.location === selectedLocation;

    const matchesStatus = selectedStatus === "All" ? true : p.status === selectedStatus;

    const matchesCategory =
      selectedCategory === "All Categories" ? true : p.category === selectedCategory;

    return matchesTab && matchesLocation && matchesStatus && matchesCategory;
  });

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Petitions</h1>
        </div>

        {/* Routes for list & signing */}
        <Routes>
          {/* Petition List */}
          <Route
            path="/"
            element={
              <>
                {/* Tabs + Filters */}
                <div className="flex flex-wrap justify-between items-center mb-8">
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
                  <div className="flex gap-3 ml-auto">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>All Locations</option>
                      <option>San Diego</option>
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
                      <option>Under Review</option>
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

                {/* Petitions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {filteredPetitions.map((petition) => (
                    <PetitionCard
                      key={petition.id}
                      petition={petition}
                      onSign={() => navigate(`/petitions/${petition.id}/sign`)}
                    />
                  ))}
                </div>

                {/* CTA Section */}
                <div className="mt-12 bg-gray-50 border rounded-lg p-6 text-center shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Have an issue that needs attention?
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Create a petition to gather support and bring visibility to the
                    issues that matter most in your community.
                  </p>
                  <button
                    onClick={() => navigate("/dashboard/citizen/create-petition")}
                    className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                  >
                    Create a Petition
                  </button>
                </div>
              </>
            }
          />

          {/* Sign Petition Route */}
          <Route
            path=":id/sign"
            element={<SignPetition onSign={onSign} currentUser={currentUser} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default PetitionPage;

