import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OfficialUnderReviewPetitions({ approvedPetitions: dynamicApproved }) {
  const [approvedPetitions, setApprovedPetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const [loading, setLoading] = useState(false);
const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  // Fetch petitions that are under review
   const getUnderReviewPetitions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/petition");
      if (response.data) {
        const underReview = response.data.filter((p) => p.status === "Under Review");

        // ✅ Fetch signature counts for each petition
        const petitionsWithSignatures = await Promise.all(
          underReview.map(async (p) => {
            try {
              const sigRes = await api.get(`/petition/signature/${p._id}`);
              return { ...p, signatureCount: sigRes.data.total || 0 };
            } catch {
              return { ...p, signatureCount: 0 };
            }
          })
        );

        setApprovedPetitions(petitionsWithSignatures);
      }
    } catch (err) {
      console.error("Error fetching petitions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update petition status (resolve/reject)
  const updatePetitionStatus = async (id, status) => {
    try {
      await api.put(`/petition/petition/${id}/status`, { status });
      // Remove petition from current Under Review list after status change
      setApprovedPetitions((prev) => prev.filter((p) => p._id !== id));
     if (status === "Resolved") {
        toast.success("You have resolved a petition successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (status === "Rejected") {
        toast.info("⚠️ You have rejected a petition.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    
    
    } catch (err) {
      console.error(`Error updating petition ${id} to ${status}:`, err);
    }
  };

  useEffect(() => {
    getUnderReviewPetitions();
  }, []);

  useEffect(() => {
    // Merge petitions passed from parent with backend ones
    if (dynamicApproved && dynamicApproved.length > 0) {
      setApprovedPetitions((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const newOnes = dynamicApproved.filter((p) => !ids.has(p._id));
        return [...prev, ...newOnes];
      });
    }
  }, [dynamicApproved]);

  const locations = [
    "All Locations",
    ...new Set(approvedPetitions.filter((p) => p && p.location).map((p) => p.location)),
  ];

  const categories = [
    "All Categories",
    ...new Set(approvedPetitions.filter((p) => p && p.category).map((p) => p.category)),
  ];

  const filteredPetitions = approvedPetitions
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(
      (p) =>
        (selectedLocation === "All Locations" || p.location === selectedLocation) &&
        (selectedCategory === "All Categories" || p.category === selectedCategory)
    );


  return (
    <div className="w-full bg-blue-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Under Review Petitions</h1>
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
              {filteredPetitions.length > 0 ? (
                filteredPetitions.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-700">{p.title}</td>
                    <td className="p-3">{p.createdBy?.name || "Unknown"}</td>
                    <td className="p-3">{p.signatureCount}</td>
                    <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Link
                        to={`/dashboard/official/petitions/view/${p._id}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => updatePetitionStatus(p._id, "Resolved")}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => updatePetitionStatus(p._id, "Rejected")}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No petitions under review
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
