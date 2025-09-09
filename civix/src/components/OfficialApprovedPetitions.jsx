/*import React from "react";

export default function OfficialApprovedPetitions({ approvedPetitions }) {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Approved Petitions</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Signatures</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedPetitions.length > 0 ? (
                approvedPetitions.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.createdBy}</td>
                    <td className="p-3">{p.signatures}</td>
                    <td className="p-3">{p.date}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm font-medium">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">
                    No approved petitions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}*/
import React, { useState } from "react";

const sampleApprovedPetitions = [
  {
    id: 1,
    title: "Petition for Improved Public Transportation in Downtown",
    category: "Infrastructure",
    createdBy: "Community Advocates",
    signatures: "15,432",
    date: "2023-11-06",
    status: "Approved",
  },
  {
    id: 2,
    title: "Request for Funding for Local Park Renovation Project",
    category: "Environment",
    createdBy: "Green City Initiative",
    signatures: "8,765",
    date: "2023-11-07",
    status: "Approved",
  },
];

export default function OfficialApprovedPetitions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const filteredPetitions = sampleApprovedPetitions.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesDate = !dateFilter || p.date === dateFilter;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setDateFilter("");
  };

  return (
    /*<div className="flex-1 bg-gray-50 min-h-screen p-6">*/
    <div className="w-full h-full min-h-screen bg-blue-50 p-6 overflow-hidden">
      <h1 className="text-3xl font-bold text-blue-700">Approved Petitions List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search petitions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded text-sm w-full sm:w-64"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded text-sm"
        >
          <option>All</option>
          <option>Infrastructure</option>
          <option>Environment</option>
          <option>Education</option>
          <option>Urban Planning</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border rounded text-sm"
        />
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse text-base">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Signatures</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPetitions.length > 0 ? (
              filteredPetitions.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{p.title}</td>
                  <td className="p-3 whitespace-nowrap">{p.category}</td>
                  <td className="p-3">{p.createdBy}</td>
                  <td className="p-3">{p.signatures}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm font-medium">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No approved petitions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
