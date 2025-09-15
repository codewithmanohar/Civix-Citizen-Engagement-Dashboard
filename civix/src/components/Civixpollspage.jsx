// src/CivixPollsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CivixPollsPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Active Polls");
  const [selectedLocation, setSelectedLocation] = useState("San Diego");

  const tabs = ["Active Polls", "Polls I Voted On", "My Polls", "Closed Polls"];
  const locations = ["San Diego", "Los Angeles", "Orange County"];

  const defaultPolls = [ /* ...your default polls... */ ];

  const [polls, setPolls] = useState(() => {
    try {
      const saved = localStorage.getItem("civix_polls");
      return saved ? JSON.parse(saved) : defaultPolls;
    } catch {
      return defaultPolls;
    }
  });

  useEffect(() => {
    localStorage.setItem("civix_polls", JSON.stringify(polls));
  }, [polls]);

  const filteredPolls = polls.filter(
    (poll) => poll.status === selectedTab && poll.location === selectedLocation
  );

  const handleVote = (poll) => {
    navigate(`/polls/${poll.id}`, { state: { poll } });
  };

  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">

      {/* Fixed Header */}
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

      {/* Scrollable Polls List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
        {filteredPolls.length > 0 ? (
          <ul className="space-y-4">
            {filteredPolls.map((poll) => (
              <li
                key={poll.id}
                className="flex justify-between items-center bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {poll.title}
                  </h3>
                  <p className="text-sm text-gray-500">{poll.summary}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted: {poll.date} • Responses: {poll.responses}
                  </p>
                </div>
                <div>
                  {poll.status === "Closed Polls" ? (
                    <button
                      onClick={() => handleVote(poll)}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      View Results
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVote(poll)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Vote Now
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white border rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-3">
              No polls found with the current filters.
            </p>
            <button
              onClick={() => {
                setSelectedTab("Active Polls");
                setSelectedLocation("San Diego");
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Fixed Footer CTA */}
      <div className="p-6 bg-white border-t shadow flex-shrink-0">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Have a question for your community?
          </h2>
          <p className="text-gray-600 mt-2">
            Create a poll to gather input and understand public sentiment on local issues.
          </p>
          <button
            onClick={() => navigate("/polls/create")}
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
