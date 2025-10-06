import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OfficialDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPetitions: 0,
    underReview: 0,
    resolvedIssues: 0,
    rejectedPetition: 0,
  });

  const [categoryStats, setCategoryStats] = useState({ labels: [], data: [] });
  const [recentPetition, setRecentPetition] = useState([]);
  const [petitionLoader, setPetitionLoader] = useState(false);
  const [statsLoader, setStatsLoader] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false); // Modal visibility

  // ------------------ SIGN OUT ------------------
  const handleSignout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    sessionStorage.clear();
    navigate("/");
  };

  // ------------------ BACK BUTTON LOGIC ------------------
  useEffect(() => {
    const handleBack = (event) => {
      event.preventDefault();
      setShowConfirm(true); // Show custom modal instead of window.confirm
      window.history.pushState(null, "", window.location.pathname); // Stay on page
    };

    window.history.pushState(null, "", window.location.pathname); // Push initial state
    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  // ------------------ API FETCHES ------------------
  const getStats = async () => {
    const response = await api.get("/dashboard/petition-stats");
    const { total, under_review, resolved, rejected } = response.data.stats;
    setStats({
      totalPetitions: total,
      underReview: under_review,
      resolvedIssues: resolved,
      rejectedPetition: rejected,
    });
  };

  const getRecentPetition = async () => {
    try {
      setPetitionLoader(true);
      const response = await api.get("/dashboard/recent-petitions");
      setRecentPetition(
        response.data.recent.map((item) => ({
          title: item.title,
          by: item.createdBy?.name || "Unknown",
          signatures: item.signatures?.length || 0,
          status: item.status,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setPetitionLoader(false);
    }
  };

  const getPieData = async () => {
    try {
      setStatsLoader(true);
      const response = await api.get("/dashboard/petition-category-stats");
      if (response.data.success) {
        setCategoryStats({ labels: response.data.labels, data: response.data.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoader(false);
    }
  };

  useEffect(() => {
    getStats();
    getRecentPetition();
    getPieData();
  }, []);

  // ------------------ CHART DATA ------------------
  const pieData = {
    labels: categoryStats.labels,
    datasets: [
      {
        data: categoryStats.data,
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  const statItems = [
    { label: "Total Petitions", value: stats.totalPetitions },
    { label: "Under Review", value: stats.underReview },
    { label: "Resolved Issues", value: stats.resolvedIssues },
    { label: "Rejected Petitions", value: stats.rejectedPetition },
  ];

  const updates = [
    "System Update: New Petition Workflow",
    "Petition API Interface Launched",
    "Scheduled Maintenance (Sept 15, 2–4 AM)",
  ];

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
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
                {petitionLoader ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentPetition.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{p.title}</td>
                      <td className="p-2">{p.by}</td>
                      <td className="p-2">{p.signatures}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${
                            p.status === "Resolved"
                              ? "bg-green-600"
                              : p.status === "Rejected"
                              ? "bg-red-600"
                              : "bg-blue-500 text-black"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg shadow">
  <h2 className="text-lg font-semibold text-blue-800 mb-2">Petitions by Category</h2>
  <div className="h-64">
    {statsLoader ? (
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-full">
        <Pie data={pieData} />
      </div>
    )}
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

      {/* ------------------ SIGN OUT MODAL ------------------ */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-[400px] bg-white shadow-2xl border border-gray-200 rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-900 text-lg font-semibold mb-4 text-center">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignout}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
