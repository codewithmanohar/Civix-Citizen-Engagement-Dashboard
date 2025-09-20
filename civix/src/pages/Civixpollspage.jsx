import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CivixPollsPage = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all"); // all, mine, closed
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [locations, setLocations] = useState([]);

  // Get logged-in user name from localStorage
  const currentUserName = localStorage.getItem("name");

  const tabs = ["all", "mine", "closed"];

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/api/polls");
        const data = res.data || [];
        setPolls(data);

        // Extract unique locations dynamically
        const uniqueLocations = [
          "All Locations",
          ...new Set(data.filter(p => p && p.targetLocation).map(p => p.targetLocation))
        ];
        setLocations(uniqueLocations);
      } catch (err) {
        console.error("Error fetching polls", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Filter polls based on tab and location
  const filteredPolls = polls
    .filter(p => p) // remove null/undefined
    .filter(p => {
      // Tab logic using creator's name
      if (selectedTab === "mine") return p.createdBy?.name === currentUserName;
      if (selectedTab === "closed") return p.isClosed === true;
      return true; // "all"
    })
    .filter(p => selectedLocation === "All Locations" || p.targetLocation === selectedLocation);

  const handleVote = (poll) => {
    navigate(`/polls/${poll._id}`, { state: { poll } });
  };

  if (loading) return <div className="p-6">Loading polls...</div>;

  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">
      {/* Header */}
      <div className="bg-blue-50 px-6 py-4 border-b shadow flex-shrink-0">
        <h1 className="text-blue-900 text-3xl font-bold mb-4">Polls</h1>

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
                {tab === "all" ? "All Polls" : tab === "mine" ? "My Polls" : "Closed Polls"}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500">📍</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map(loc => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Polls List */}
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
                    Posted: {new Date(poll.createdAt).toLocaleDateString()} • Responses:{" "}
                    {poll.options?.reduce((acc, o) => acc + (o.votes || 0), 0) || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Location: {poll.targetLocation || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created By: {poll.createdBy?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleVote(poll)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Vote Now
                  </button>
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

      {/* Footer CTA */}
      <div className="p-6 bg-gray-50 border-t shadow flex-shrink-0">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-800">Have a question?</h2>
          <p className="text-gray-600 mt-2">Create a poll for your community.</p>
          <button
            onClick={() => navigate("/dashboard/citizen/polls/create")}
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Create a Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CivixPollsPage;
