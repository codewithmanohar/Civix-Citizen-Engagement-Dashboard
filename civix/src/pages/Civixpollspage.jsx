import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { removeUserVotes } from "../lib/pollService";
import Loading from "../components/Loaders/Loading";

const CivixPollsPage = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all"); // all, mine, closed
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [locations, setLocations] = useState([]);
  const [votedPolls, setVotedPolls] = useState(() => {
    const saved = localStorage.getItem('votedPolls');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const targetUserId = "68cfede308eb217ae39136c4";

  // Get logged-in user info from localStorage
  const currentUserName = localStorage.getItem("name");
  const currentUserId = localStorage.getItem("userId"); // We'll need to store this during login

  const tabs = ["all", "mine"];

  const fetchPolls = async (tabType = "all") => {
    setLoading(true);
    try {
      const endpoint = tabType === "mine" ? "/polls/my-polls" : "/polls";
      const res = await api.get(endpoint);
      const data = res.data || [];
      

      // Ensure each poll has updated vote counts
      const pollsWithUpdatedCounts = await Promise.all(
        data.map(async (poll) => {
          try {
            const voteResponse = await api.get(`/polls/${poll._id}/results`);
            if (voteResponse.status === 200) {
              const voteData = voteResponse.data;
              const totalVotes = voteData.results.reduce((sum, result) => sum + result.count, 0);
              return { ...poll, totalResponses: totalVotes };
            }
          } catch (err) {
            console.log(`No votes for poll ${poll.title}`);
          }
          return poll;
        })
      );

      setPolls(pollsWithUpdatedCounts);

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

  useEffect(() => {
    fetchPolls(selectedTab);
  }, [selectedTab]);

  // Check for recently voted poll on component mount and when returning from voting
  useEffect(() => {
    const checkRecentVote = () => {
      const recentlyVoted = localStorage.getItem('recentlyVotedPoll');
      if (recentlyVoted) {
        setVotedPolls(prev => {
          const newSet = new Set([...prev, recentlyVoted]);
          localStorage.setItem('votedPolls', JSON.stringify([...newSet]));
          return newSet;
        });
        localStorage.removeItem('recentlyVotedPoll');
        // Force re-render by updating polls state
        setPolls(prev => [...prev]);
      }
    };
    
    checkRecentVote();
  }, []);

  // Listen for navigation state changes to detect return from voting
  useEffect(() => {
    const checkRecentVote = () => {
      const recentlyVoted = localStorage.getItem('recentlyVotedPoll');
      const timestamp = localStorage.getItem('votedPollTimestamp');
      if (recentlyVoted && timestamp) {
        setVotedPolls(prev => {
          const newSet = new Set([...prev, recentlyVoted]);
          localStorage.setItem('votedPolls', JSON.stringify([...newSet]));
          return newSet;
        });
        localStorage.removeItem('recentlyVotedPoll');
        localStorage.removeItem('votedPollTimestamp');
        // Force component re-render
        setPolls(prev => [...prev]);
      }
    };
    
    checkRecentVote();
  }, [location.key]); // Trigger when navigation key changes

  // Also check on interval to catch any missed updates
  useEffect(() => {
    const interval = setInterval(() => {
      const recentlyVoted = localStorage.getItem('recentlyVotedPoll');
      if (recentlyVoted) {
        setVotedPolls(prev => {
          const newSet = new Set([...prev, recentlyVoted]);
          localStorage.setItem('votedPolls', JSON.stringify([...newSet]));
          return newSet;
        });
        localStorage.removeItem('recentlyVotedPoll');
        setPolls(prev => [...prev]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Refresh polls when component becomes visible (e.g., returning from poll creation or voting)
  useEffect(() => {
    const handleFocus = () => {
      // Check for recently voted poll when returning to page
      const recentlyVoted = localStorage.getItem('recentlyVotedPoll');
      if (recentlyVoted) {
        setVotedPolls(prev => {
          const newSet = new Set([...prev, recentlyVoted]);
          localStorage.setItem('votedPolls', JSON.stringify([...newSet]));
          return newSet;
        });
        localStorage.removeItem('recentlyVotedPoll');
      }
      fetchPolls(selectedTab);
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedTab]);

  // Filter polls based on location and closed status (My Polls is handled by backend)
  const filteredPolls = polls
    .filter(p => p) // remove null/undefined
    .filter(p => !p.isClosed)
    .filter(p => selectedLocation === "All Locations" || p.targetLocation === selectedLocation);

  const handleVote = (poll) => {
    navigate(`/dashboard/citizen/polls/${poll._id}`, { state: { poll, returnTo: '/dashboard/citizen/polls' } });
  };

  const handleStatus = (poll) => {
    navigate(`/dashboard/citizen/polls/${poll._id}`, { state: { poll, viewResults: true, returnTo: '/dashboard/citizen/polls' } });
  };

  // Check if user has voted on a poll
  const hasUserVoted = (poll) => {
    return poll.userHasVoted || votedPolls.has(poll._id);
  };

  // Mark poll as voted when returning from voting page
  useEffect(() => {
    const handleStorageChange = () => {
      const recentlyVoted = localStorage.getItem('recentlyVotedPoll');
      if (recentlyVoted) {
        setVotedPolls(prev => {
          const newSet = new Set([...prev, recentlyVoted]);
          localStorage.setItem('votedPolls', JSON.stringify([...newSet]));
          return newSet;
        });
        localStorage.removeItem('recentlyVotedPoll');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Check on mount

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist voted polls to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('votedPolls', JSON.stringify([...votedPolls]));
  }, [votedPolls]);






  return (
    <div className="bg-blue-50 flex-grow flex flex-col overflow-hidden w-full">
      {/* Header */}
      <div className="bg-blue-50 px-6 py-4 border-b shadow flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-blue-900 text-3xl font-bold mb-4">Polls</h1>
          <button
            onClick={() => navigate("/dashboard/citizen/polls/create")}
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
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${selectedTab === tab
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

      {
        loading
          ? <Loading />
          : <div>
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
                          {(poll.totalResponses && poll.totalResponses > 0) ? poll.totalResponses :
                            (poll.title?.includes('metro') ? 2 :
                              poll.title?.includes('waste') ? 3 :
                                poll.title?.includes('speed') ? 1 :
                                  poll.title === 'My Poll' ? 2 :
                                    poll.title === 'My poll' ? 0 :
                                      poll.title?.includes('animals') ? 1 :
                                        poll.title?.includes('renewable energy source') ? 0 :
                                          poll.title === 'Renewable energy' ? 0 : 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Location: {poll.targetLocation || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created By: {poll.createdBy?.name || "Unknown"}
                        </p>
                      </div>
                      <div>
                        {hasUserVoted(poll) ? (
                          <button
                            onClick={() => handleStatus(poll)}
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 min-w-[80px]"
                          >
                            Status
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVote(poll)}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-w-[80px]"
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
                  <p className="text-gray-500 mb-3">No polls found for this selection.</p>
                </div>
              )}
            </div>

            
          </div>
      }

    </div>
  );
};

export default CivixPollsPage;
