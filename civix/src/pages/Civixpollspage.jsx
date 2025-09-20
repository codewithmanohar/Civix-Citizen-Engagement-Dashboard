// src/CivixPollsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CivixPollsPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Active Polls");
  const [selectedLocation, setSelectedLocation] = useState("San Diego");
  const [polls, setPolls] = useState([]);

  const tabs = ["Active Polls", "My Polls", "Closed Polls"];
  const locations = ["AP", "San Diego", "Los Angeles", "Orange County"];

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/polls")
      .then((res) => setPolls(res.data))
      .catch((err) => console.error("Error fetching polls", err));
  }, []);

  const filteredPolls = polls.filter(
    (poll) => poll.targetLocation === selectedLocation
  );

  const handleVote = (poll) => {
    navigate(`/polls/${poll._id}`, { state: { poll } });
  };

  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">
      {/* Header */}
      <div className="bg-blue-50 px-6 py-4 border-b shadow flex-shrink-0">
        <h1 className="text-blue-900 text-3xl font-bold mb-4">Polls</h1>
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-gray-500">📍</span>
            <select
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring focus:ring-blue-200"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Polls List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
        {filteredPolls.length > 0 ? (
          <ul className="space-y-4">
            {filteredPolls.map((poll) => (
              <li
                key={poll._id}
                className="flex justify-between items-center bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{poll.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted: {new Date(poll.createdAt).toLocaleDateString()} • Responses:{" "}
                    {poll.options.reduce((acc, o) => acc + (o.votes || 0), 0)}
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
            <p className="text-gray-500 mb-3">No polls found for this location.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t shadow flex-shrink-0">
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
