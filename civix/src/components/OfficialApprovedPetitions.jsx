import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function OfficialApprovedPetitions({ approvedPetitions: dynamicApproved }) {
  const [approvedPetitions, setApprovedPetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getApprovedPetitions = async () => {
    try {
      const response = await api.get("/petition");
      if (response.data) {
        const approved = response.data.filter((p) => p.status === "Active");
        setApprovedPetitions(approved);
      }
    } catch (err) {
      console.error("Error fetching approved petitions:", err);
    }
  };

  useEffect(() => {
    getApprovedPetitions();
  }, []);

  useEffect(() => {
    // Merge dynamic approved petitions from parent with backend ones
    if (dynamicApproved && dynamicApproved.length > 0) {
      setApprovedPetitions((prev) => {
        // Avoid duplicates
        const ids = new Set(prev.map((p) => p._id));
        const newOnes = dynamicApproved.filter((p) => !ids.has(p._id));
        return [...prev, ...newOnes];
      });
    }
  }, [dynamicApproved]);

  const filteredPetitions = approvedPetitions.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-blue-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Approved Petitions</h1>
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search petitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-400 w-56"
            />
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
                    <td className="p-3">{p.signatures?.length || 0}</td>
                    <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
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
                    No approved petitions
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
