import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OfficialActivePetitions({ onApprove }) {
  const [activePetitions, setActivePetition] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
   const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  // Fetch pending petitions
  const getActivePetitions = async () => {
  try {
    setLoading(true);
    const response = await api.get("/petition");
    if (response.data) {
      const activePetitions = response.data.filter((p) => p.status === "Active");

      // Fetch signature counts for each petition
      const petitionsWithSignatures = await Promise.all(
        activePetitions.map(async (p) => {
          try {
            const sigRes = await api.get(`/petition/signature/${p._id}`);
            return { ...p, signatureCount: sigRes.data.total || 0 };
          } catch {
            return { ...p, signatureCount: 0 };
          }
        })
      );

      setActivePetition(petitionsWithSignatures);
    }
  } catch (err) {
    console.error("Error fetching active petitions:", err);
  } finally {
    setLoading(false);
  }
};

  

  useEffect(() => {
    getActivePetitions();
  }, []);
// Unique locations & categories
  const locations = [
    "All Locations",
    ...new Set(activePetitions.filter((p) => p && p.location).map((p) => p.location)),
  ];

  const categories = [
    "All Categories",
    ...new Set(activePetitions.filter((p) => p && p.category).map((p) => p.category)),
  ];
   const filteredPetitions = activePetitions
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(
      (p) =>
        (selectedLocation === "All Locations" || p.location === selectedLocation) &&
        (selectedCategory === "All Categories" || p.category === selectedCategory)
    );

  // Approve petition
  const handleApprove = async (id) => {
    try {
      const response = await api.put(`/petition/petition/${id}/status`, {
        status: "Under Review", 
      });

      if (response.data) {
        // Remove from Pending list
        const approvedPetition = activePetitions.find((p) => p._id === id);
        setActivePetition((prev) => prev.filter((p) => p._id !== id));

        // Notify parent (Approved table) to add this petition
        if (onApprove) onApprove({ ...approvedPetition, status: "Active" });
        toast.success(" Petition has been approved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      }
    } catch (err) {
      console.error("Error approving petition:", err);
    }
  };

  // Reject petition
  const handleReject = async (id) => {
    try {
      await api.put(`/petition/petition/${id}/status`, { status: "Rejected" });
      setActivePetition((prev) => prev.filter((p) => p._id !== id));
     toast.info("⚠️ Petition has been rejected.", {
      position: "top-right",
      autoClose: 3000,
    });
    
    } catch (err) {
      console.error("Error rejecting petition:", err);
    }
  };

  return (
    <div className="w-full bg-blue-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Active Petitions</h1>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Created By</th>
                <th className="p-3">Signatures</th>
                <th className="p-3">Date</th>
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
                    <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleApprove(p._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        Reject
                      </button>
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
                    No active petitions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />

    </div>
  );
}
