// src/components/OfficialDashboard.jsx
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OfficialDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPetitions: 0,
    pendingApprovals: 0,
    resolvedIssues: 0,
    citizenFeedback: 0,
  });

  const petitions = [
    { title: "Improve Public Transport Accessibility", by: "Alex Johnson", signatures: 3210, status: "Approved" },
    { title: "New Recycling Program Implementation", by: "Carla White", signatures: 2145, status: "Under Review" },
    { title: "Increase Police Presence in Downtown", by: "Bob Daniels", signatures: 1876, status: "Approved" },
    { title: "Ban Single-Use Plastics Citywide", by: "Emily Clark", signatures: 2987, status: "Approved" },
    { title: "Expand Access to Mental Health Services", by: "Eve Adams", signatures: 1654, status: "Under Review" },
  ];

  const updates = [
    "System Update: New Petition Workflow",
    "Petition API Interface Launched",
    "Scheduled Maintenance (Sept 15, 2–4 AM)",
  ];

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {}); // ignore demo errors
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    navigate("/");
  };

  const statItems = [
    { label: "Total Petitions", value: stats.totalPetitions },
    { label: "Pending Approvals", value: stats.pendingApprovals },
    { label: "Resolved Issues", value: stats.resolvedIssues },
    { label: "Citizen Feedback", value: stats.citizenFeedback },
  ];

  const pieData = {
    labels: ["Infrastructure", "Public Safety", "Environment", "Health", "Education"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Official Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statItems.map((s, i) => (
            <div key={i} className="bg-blue-100 p-4 rounded-lg shadow text-center">
              <h3 className="text-blue-800 font-semibold">{s.label}</h3>
              <p className="text-2xl font-bold text-blue-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent + Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white border rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Recent Petitions</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Submitted By</th>
                  <th className="p-2 text-left">Signatures</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {petitions.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">{p.by}</td>
                    <td className="p-2">{p.signatures}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          p.status === "Approved"
                            ? "bg-green-600"
                            : p.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Petitions by Category</h2>
            <div className="h-64">
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Official Updates</h2>
          <ul className="list-disc list-inside text-blue-800">
            {updates.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
