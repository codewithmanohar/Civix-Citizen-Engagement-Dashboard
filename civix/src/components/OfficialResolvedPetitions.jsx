import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function OfficialResolvedPetitions() {
  const [resolvedPetitions, setResolvedPetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  // Fetch all petitions and filter for "Resolved"
  const getResolvedPetitions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/petition");
      if (response.data) {
        const resolved = response.data.filter((p) => p.status === "Resolved");

        const petitionsWithSignatures = await Promise.all(
          resolved.map(async (p) => {
            try {
              const sigRes = await api.get(`/petition/signature/${p._id}`);
              return { ...p, signatureCount: sigRes.data.total || 0 };
            } catch {
              return { ...p, signatureCount: 0 };
            }
          })
        );

        setResolvedPetitions(petitionsWithSignatures);
      }
    } catch (err) {
      console.error("Error fetching resolved petitions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResolvedPetitions();
  }, []);

   // Unique locations & categories
  const locations = [
    "All Locations",
    ...new Set(resolvedPetitions.filter((p) => p && p.location).map((p) => p.location)),
  ];

  const categories = [
    "All Categories",
    ...new Set(resolvedPetitions.filter((p) => p && p.category).map((p) => p.category)),
  ];

  const filteredPetitions = resolvedPetitions
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(
      (p) =>
        (selectedLocation === "All Locations" || p.location === selectedLocation) &&
        (selectedCategory === "All Categories" || p.category === selectedCategory)
    );

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Resolved Petitions</h1>
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search petitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-400 w-56"
            />
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Signatures</th>
                <th className="p-3">Resolution Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredPetitions.length > 0 ? (
                filteredPetitions.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-700">{p.title}</td>
                    <td className="p-3">{p.createdBy?.name || "Unknown"}</td>
                    <td className="p-3">{p.signatureCount}</td>
                    <td className="p-3">
  {p.updatedAt
    ? new Date(p.updatedAt).toLocaleDateString()
    : "N/A"}
</td>

                    <td className="p-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/dashboard/official/petitions/view/${p._id}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No resolved petitions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
