import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Loading from "../components/Loaders/Loading";

const OfficialPollsPage = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all"); // all, mine, closed
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);

  const tabs = ["all", "mine", "closed"];

  const currentUserId = localStorage.getItem("userId"); // Logged-in official

  const fetchPolls = async (tabType = "all") => {
    setLoading(true);
    try {
      let endpoint = "/polls";
      if (tabType === "closed") endpoint = "/polls/closed";
      if (tabType === "mine") endpoint = "/polls/my-polls"; // backend route for my polls

      const res = await api.get(endpoint);
      const data = Array.isArray(res.data) ? res.data : res.data.polls || [];

      // Add totalResponses for each poll
      const pollsWithCounts = await Promise.all(
        data.map(async (poll) => {
          try {
            const voteRes = await api.get(`/polls/${poll._id}/results`);
            if (voteRes.status === 200) {
              const totalVotes = voteRes.data.results.reduce((sum, r) => sum + r.count, 0);
              return { ...poll, totalResponses: totalVotes };
            }
          } catch {
            return poll;
          }
          return poll;
        })
      );

      setPolls(pollsWithCounts);

      // Extract unique locations and departments
      const uniqueLocations = ["All Locations", ...new Set(data.filter(p => p && p.targetLocation).map(p => p.targetLocation))];
      //const uniqueDepartments = ["All Departments", ...new Set(data.filter(p => p && p.department).map(p => p.department))];

      setLocations(uniqueLocations);
      //setDepartments(uniqueDepartments);
    } catch (err) {
      console.error("Error fetching polls", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    const handleFocus = () => fetchPolls(selectedTab);
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchPolls(selectedTab);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [selectedTab]);

  // Filter polls by location and department
  const filteredPolls = polls
    .filter(p => p)
    .filter(p => selectedLocation === "All Locations" || p.targetLocation === selectedLocation)
    //.filter(p => selectedDepartment === "All Departments" || p.department === selectedDepartment)
    .filter(p => {
      if (selectedTab === "closed") return p.status === "Closed";
      if (selectedTab === "mine") return p.createdBy?._id === currentUserId;
      return true;
    });

  const handleViewResults = (poll) => {
    navigate(`/dashboard/official/polls/${poll._id}`, {
      state: { from: location.pathname, viewResults: true },
    });
  };

  const handleClosePoll = async (pollId) => {
    try {
      const res = await api.patch(`/polls/${pollId}/close`);
      if (res.data.success) {
        alert("Poll closed successfully!");
        fetchPolls(selectedTab);
      }
    } catch (error) {
      console.error("Error closing poll:", error);
      alert("Failed to close poll");
    }
  };

  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">
      {/* Header */}
      <div className="bg-blue-50 px-6 py-4 border-b shadow flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-blue-900 text-3xl font-bold mb-4">Polls</h1>
          <button
            onClick={() => navigate("/dashboard/official/polls/create")}
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Create a Poll
          </button>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab === "all" ? "Active Polls" : tab === "mine" ? "My Polls" : "Closed Polls"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500">📍</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map(loc => <option key={loc}>{loc}</option>)}
            </select>

            
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {filteredPolls.length > 0 ? (
            <ul className="space-y-4">
              {filteredPolls.map(poll => (
                <li
                  key={poll._id}
                  className="flex justify-between items-center bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{poll.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Posted: {new Date(poll.createdAt).toLocaleDateString()} •
                      Responses: {poll.totalResponses || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Location: {poll.targetLocation || "Unknown"}</p>
                    
                    <p className="text-xs text-gray-500 mt-1">Created By: {poll.createdBy?.name || "Unknown"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewResults(poll)}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 min-w-[80px]"
                    >
                      View Result
                    </button>

                    {poll.status === "Closed" ? (
                      <button
                        disabled
                        className="px-4 py-2 text-sm bg-gray-400 text-white rounded-lg cursor-not-allowed min-w-[80px]"
                      >
                        Closed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClosePoll(poll._id)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 min-w-[80px]"
                      >
                        Close Poll
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-white border rounded-lg shadow p-6 text-center">
              <p className="text-gray-500 mb-3">No polls found for this selection.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfficialPollsPage;
