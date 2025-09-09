/*import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const petitions = [
  {
    id: 1,
    title: "Petition for Improved Public Transportation in Downtown",
    category: "Infrastructure",
    createdBy: "Community Advocates",
    signatures: "15,432",
    date: "2023-11-01",
    status: "Pending",
  },
  {
    id: 2,
    title: "Request for Funding for Local Park Renovation Project",
    category: "Environment",
    createdBy: "Green City Initiative",
    signatures: "8,765",
    date: "2023-11-05",
    status: "Pending",
  },
];

export default function OfficialPendingPetitions() {
  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-50 min-h-screen">
      {/* Header *}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pending Petitions</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute top-2 left-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters & Bulk Actions *}
      <div className="flex space-x-4 mb-4">
        <select className="border px-4 py-2 rounded">
          <option>All Categories</option>
          <option>Infrastructure</option>
          <option>Environment</option>
          <option>Education</option>
          <option>Urban Planning</option>
        </select>
        <input type="date" className="border px-4 py-2 rounded" />
        <button className="px-4 py-2 bg-gray-300 rounded" disabled>
          Approve Selected (0)
        </button>
        <button className="px-4 py-2 bg-red-100 text-red-600 rounded" disabled>
          Reject Selected (0)
        </button>
      </div>

      {/* Table *}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">Petition Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Created By</th>
              <th className="p-3">Total Signatures</th>
              <th className="p-3">Submission Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {petitions.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" /></td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.createdBy}</td>
                <td className="p-3">{p.signatures}</td>
                <td className="p-3">{p.date}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm">
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded">
                      Reject
                    </button>
                    <Link
                      to={`/dashboard/official/petitions/view/${p.id}`}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
import React, { useState } from "react"; // <-- make sure useState is imported
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

// Initial petitions array
const initialPetitions = [
  {
    id: 1,
    title: "Petition for Improved Public Transportation in Downtown",
    category: "Infrastructure",
    createdBy: "Community Advocates",
    signatures: "15,432",
    date: "2023-11-01",
    status: "Pending",
  },
  {
    id: 2,
    title: "Request for Funding for Local Park Renovation Project",
    category: "Environment",
    createdBy: "Green City Initiative",
    signatures: "8,765",
    date: "2023-11-05",
    status: "Pending",
  },
];

export default function OfficialPendingPetitions({ addToApproved }) {
  // Use a different variable name for state
  const [pendingPetitions, setPendingPetitions] = useState(initialPetitions);

  const handleApprove = (id) => {
    const petition = pendingPetitions.find((p) => p.id === id);
    if (petition) {
      addToApproved({ ...petition, status: "Approved" });
      setPendingPetitions(pendingPetitions.filter((p) => p.id !== id));
    }
  };

  return (
    /*<div className="flex-1 p-6 bg-gray-50 min-h-screen flex justify-center">
       <div className="w-full min-h-screen bg-blue-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        {/* Header *}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Pending Petitions</h1>
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-400 w-56"
            />
          </div>
        </div>

        {/* Filters *}
        <div className="flex flex-wrap gap-3 mb-6 text-base">
          <select className="border px-3 py-2 rounded shadow-sm hover:shadow-md transition duration-200">
            <option>All Categories</option>
            <option>Infrastructure</option>
            <option>Environment</option>
            <option>Education</option>
            <option>Urban Planning</option>
          </select>
          <input type="date" className="border px-3 py-2 rounded text-base" />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition"
            disabled
          >
            Approve Selected (0)
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition"
            disabled
          >
            Reject Selected (0)
          </button>
        </div>

        {/* Table *}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-blue-900 font-semibold w-8"><input type="checkbox" /></th>
                <th className="p-3 text-blue-900 font-semibold min-w-[180px]">Title</th>
                <th className="p-3 text-blue-900 font-semibold min-w-[100px]">Category</th>
                <th className="p-3 text-blue-900 font-semibold min-w-[120px]">Created By</th>
                <th className="p-3 text-blue-900 font-semibold min-w-[100px]">Signatures</th>
                <th className="p-3 text-blue-900 font-semibold min-w-[110px]">Date</th>
                <th className="p-3 text-blue-900 font-semibold min-w-[80px]">Status</th>
                <th className="p-3 text-blue-900 font-semibold min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPetitions.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3 font-medium text-gray-700">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.createdBy}</td>
                  <td className="p-3">{p.signatures}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm font-medium">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm">
                      Reject
                    </button>
                    <Link
                      to={`/dashboard/official/petitions/view/${p.id}`}
                      className="px-3 py-1 bg-sky-300 text-white rounded hover:bg-sky-400 transition text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {pendingPetitions.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No pending petitions
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
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

// Initial petitions array
const initialPetitions = [
  {
    id: 1,
    title: "Petition for Improved Public Transportation in Downtown",
    category: "Infrastructure",
    createdBy: "Community Advocates",
    signatures: "15,432",
    date: "2023-11-01",
    status: "Pending",
  },
  {
    id: 2,
    title: "Request for Funding for Local Park Renovation Project",
    category: "Environment",
    createdBy: "Green City Initiative",
    signatures: "8,765",
    date: "2023-11-05",
    status: "Pending",
  },
];

export default function OfficialPendingPetitions({ addToApproved }) {
  const [pendingPetitions, setPendingPetitions] = useState(initialPetitions);

  const handleApprove = (id) => {
    const petition = pendingPetitions.find((p) => p.id === id);
    if (petition) {
      addToApproved?.({ ...petition, status: "Approved" });
      setPendingPetitions(pendingPetitions.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Pending Petitions</h1>
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-sky-400 w-56"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 text-base">
          <select className="border px-3 py-2 rounded shadow-sm hover:shadow-md transition duration-200">
            <option>All Categories</option>
            <option>Infrastructure</option>
            <option>Environment</option>
            <option>Education</option>
            <option>Health care</option>
            <option>Public Safety</option>
            <option>Transportation</option>
            <option>Housing</option>
          </select>
          <input type="date" className="border px-3 py-2 rounded text-base" />
           <select className="border px-3 py-2 rounded shadow-sm hover:shadow-md transition duration-200">
            <option>All Locations</option>
            <option>Guntur</option>
            <option>Vijayawada</option>
            <option>Visakhapatnam</option>
            <option>Hyderabad</option>
          </select>
          {/* multi-select actions left for now but disabled */}
          {/*<button
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded font-semibold cursor-not-allowed"
            disabled
          >
            Approve Selected (0)
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded font-semibold cursor-not-allowed"
            disabled
          >
            Reject Selected (0)
          </button>*/}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead className="bg-blue-100">
              <tr>
                {/* removed checkbox column */}
                <th className="p-3 text-blue-900 font-semibold min-w-[180px]">
                  Title
                </th>
                <th className="p-3 text-blue-900 font-semibold min-w-[100px]">
                  Category
                </th>
                <th className="p-3 text-blue-900 font-semibold min-w-[120px]">
                  Created By
                </th>
                <th className="p-3 text-blue-900 font-semibold min-w-[100px]">
                  Signatures
                </th>
                <th className="p-3 text-blue-900 font-semibold min-w-[110px]">
                  Date
                </th>
                <th className="p-3 text-blue-900 font-semibold min-w-[80px]">
                  Status
                </th>
                <th className="p-3 text-blue-900 font-semibold min-w-[180px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingPetitions.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-700">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.createdBy}</td>
                  <td className="p-3">{p.signatures}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm font-medium">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                    >
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">
                      Reject
                    </button>
                    <Link
                      to={`/dashboard/official/petitions/view/${p.id}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {pendingPetitions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No pending petitions
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
