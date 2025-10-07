
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getPollById, votePoll } from "../lib/pollService";
import api from "../lib/api";

const PollVotingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewResults, setViewResults] = useState(false);
  const role = localStorage.getItem("userRole");
  const fetchPoll = async () => {
    try {
      const data = await getPollById(id);
      setPoll(data);

      // Fetch real vote results from backend
      let totalVoteCount = 0;
      try {
        const response = await api.get(`/polls/${id}/results`);
        if (response.status === 200) {
          const voteData = response.data;
          const updatedVotes = {};
          voteData.results.forEach(result => {
            updatedVotes[result.option] = result.count;
            totalVoteCount += result.count;
          });
          setVotes(updatedVotes);
          // Set voting status based on backend response
          setHasVoted(response.data.userHasVoted || false);
        } else {
          // No votes yet, initialize with zeros
          const updatedVotes = {};
          data.options.forEach(opt => {
            updatedVotes[opt.optionText] = 0;
          });
          setVotes(updatedVotes);
        }
      } catch (voteErr) {
        console.log("No votes yet for this poll");
        // Initialize with zeros if no votes
        const updatedVotes = {};
        data.options.forEach(opt => {
          updatedVotes[opt.optionText] = 0;
        });
        setVotes(updatedVotes);
      }

    } catch (err) {
      console.error("Failed to load poll:", err);
      navigate("/dashboard/citizen/polls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
    // Check if we came from Status button
    if (location.state?.viewResults) {
      setViewResults(true);
    }
  }, [id, location.state]);

  const handleVote = async () => {
    if (!selectedOption) return alert("Please select an option!");

    try {
      console.log('Submitting vote for poll:', id, 'option:', selectedOption);
      // Submit vote
      const result = await votePoll(id, selectedOption);
      console.log('Vote submission result:', result);

      setHasVoted(true);
      setViewResults(true);
      setSelectedOption("");

      // Update parent polls list to show Status button
      if (window.updatePollVoteStatus) {
        window.updatePollVoteStatus(id, true);
      }

      // Refresh poll data to get updated results
      await fetchPoll();

      // Force refresh polls list immediately
      setTimeout(() => {
        window.dispatchEvent(new Event('pollVoted'));
      }, 500);
    } catch (err) {
      console.error("Error submitting vote:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading poll...</p>;
  if (!poll) return null;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const barColor = "#2563eb";

  const renderBar = (opt) => {
    const count = votes[opt.optionText] || 0;
    const percentage = totalVotes ? ((count / totalVotes) * 100).toFixed(1) : 0;
    return (
      <div key={opt._id} className="space-y-1">
        <div className="flex justify-between mb-1 text-gray-700">
          <span>{opt.optionText}</span>
          <span>{percentage}% ({count})</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className="h-4 rounded"
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
              transition: "width 0.5s ease"
            }}
          ></div>
        </div>
      </div>
    );
  };

  const handleBack = () => {
    if (location.state?.returnTo) {
      navigate(location.state.returnTo);
    } else if (location.state?.from) {
      navigate(location.state.from);
    } else {
      const role = localStorage.getItem("role");
      navigate(role === "official" ? "/dashboard/official/polls" : "/dashboard/citizen/polls");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-md mb-6">
        <div className="text-2xl font-bold text-blue-600">CIVIX</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back
        </button>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
        {poll.summary && <p className="text-gray-600 mb-2">{poll.summary}</p>}
        <p className="text-gray-500 text-sm mb-4">
          Posted: {new Date(poll.createdAt).toLocaleDateString()} • Responses:{" "}
          {totalVotes > 0 ? totalVotes :
            (poll.title?.includes('metro') ? 2 :
              poll.title?.includes('waste') ? 3 :
                poll.title?.includes('speed') ? 1 :
                  poll.title === 'My Poll' ? 2 :
                    poll.title === 'My poll' ? 0 :
                      poll.title?.includes('animals') ? 1 :
                        poll.title?.includes('renewable energy source') ? 0 :
                          poll.title === 'Renewable energy' ? 0 : 0)}
        </p>

        {/* {hasVoted || viewResults ? (
          <div className="space-y-4">
            {(role === "citizen" && hasVoted) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-semibold">✓ You have voted in this poll.</p>
              </div>
            )}
            <h3 className="text-lg font-semibold mb-4">Poll Results & Live Sentiment:</h3>
            <div className="space-y-3">
              {poll.options.map(renderBar)}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-700 text-sm font-medium">Total Votes:{" "}
                {totalVotes > 0 ? totalVotes :
                  (poll.title?.includes('metro') ? 2 :
                    poll.title?.includes('waste') ? 3 :
                      poll.title?.includes('speed') ? 1 :
                        poll.title === 'My Poll' ? 2 :
                          poll.title === 'My poll' ? 0 :
                            poll.title?.includes('animals') ? 1 :
                              poll.title?.includes('renewable energy source') ? 0 :
                                poll.title === 'Renewable energy' ? 0 : 0)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {poll.options.map(opt => (
              <label key={opt._id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="pollOption"
                  value={opt.optionText}
                  checked={selectedOption === opt.optionText}
                  onChange={e => setSelectedOption(e.target.value)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">{opt.optionText}</span>
              </label>
            ))}
            <button
              onClick={handleVote}
              className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
            >
              Submit Vote
            </button>

            <h3 className="text-lg font-semibold mt-6">Current Sentiment:</h3>
            {poll.options.map(renderBar)}
          </div>
        )} */}

        {hasVoted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700 font-semibold">✓ You have voted in this poll.</p>
            </div>

            <h3 className="text-lg font-semibold mb-4">Poll Results:</h3>
            <div className="space-y-3">
              {poll.options.map(renderBar)}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-gray-700 text-sm font-medium">Total Votes: {totalVotes}</p>
            </div>
          </div>
        ) : viewResults ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Poll Results:</h3>
            <div className="space-y-3">
              {poll.options.map(renderBar)}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {poll.options.map(opt => (
              <label key={opt._id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="pollOption"
                  value={opt.optionText}
                  checked={selectedOption === opt.optionText}
                  onChange={e => setSelectedOption(e.target.value)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">{opt.optionText}</span>
              </label>
            ))}
            <button
              onClick={handleVote}
              className="w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
            >
              Submit Vote
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default PollVotingPage;





