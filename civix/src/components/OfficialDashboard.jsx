import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetitionTable from "./Dashboard/PetitionTable";
import PetitionSearch from "./Dashboard/PetitionSearch";
import CategoryTabs from "./Dashboard/CategoryTabs";

const allPetitions = [
  { title: "Increase School Funding", category: "Education", signatures: 230, status: "Approved" },
  { title: "Improve Local Pano", category: "Infrastructure", signatures: 125, status: "Pending" },
  { title: "Road Repair In Downation", category: "Infrastructure", signatures: 87, status: "Pending" },
  { title: "Increase Air Quality", category: "Environment", signatures: 145, status: "Pending" },
  { title: "Neighborhood Watch Program", category: "Public Safety", signatures: 98, status: "Approved" },
];

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPetitions = allPetitions.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pendingPetitions = filteredPetitions.filter((p) => p.status === "Pending");

  return (
    <div className="min-h-screen bg-brand-light text-blue-900 font-sans p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Civix Official Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="bg-blue-900 text-white px-4 py-1 rounded">
            Official • Guntur, AP
          </span>

          <button
    className="bg-white hover:bg-gray-100 text-blue-900 font-semibold py-2 px-4 rounded-md border border-blue-600 shadow-sm transition duration-200"
    onClick={() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/");
    }}
  >
    Sign Out
  </button>
        </div>
      </header>

      {/* Pending Petitions */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">📌 Pending Petitions</h2>
        <CategoryTabs selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <PetitionTable petitions={pendingPetitions} showActions />
      </section>

      {/* All Petitions */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">📋 All Petitions</h2>
        <PetitionSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <PetitionTable petitions={filteredPetitions} />
      </section>
    </div>
  );
};

export default OfficialDashboard;
