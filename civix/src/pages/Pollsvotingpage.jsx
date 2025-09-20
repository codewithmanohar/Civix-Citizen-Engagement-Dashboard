import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPollById, votePoll } from "../lib/pollService";

const PollVotingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch poll from backend
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPollById(id);
        setPoll(data);

        const initialVotes = {};
        data.options.forEach((opt) => {
          initialVotes[opt.optionText] = opt.votes || 0;
        });
        setVotes(initialVotes);

        // Check if user already voted in this poll
        const votedPolls = JSON.parse(localStorage.getItem("civix_voted") || "[]");
        if (votedPolls.includes(id) || data.status === "Closed Polls") {
          setHasVoted(true);
        }
      } catch (err) {
        console.error("Failed to load poll:", err);
        navigate("/dashboard/citizen/polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, navigate]);

  // Handle vote submission
  const handleVote = async () => {
    if (!selectedOption) return alert("Please select an option!");

    try {
      const response = await votePoll(id, selectedOption);
      console.log("Vote response:", response);

      // If backend returns updated poll
      const updatedPoll = response.poll || poll; // fallback to current poll if backend doesn't return updated poll

      if (updatedPoll.options) {
        const updatedVotes = {};
        updatedPoll.options.forEach((opt) => {
          updatedVotes[opt.optionText] = opt.votes || 0;
        });

        setVotes(updatedVotes);
        setPoll(updatedPoll);
      }

      setHasVoted(true);

      // Save voted poll in localStorage
      const votedPolls = JSON.parse(localStorage.getItem("civix_voted") || "[]");
      if (!votedPolls.includes(id)) {
        localStorage.setItem("civix_voted", JSON.stringify([...votedPolls, id]));
      }

      if (!updatedPoll.options) {
        // Backend didn't return updated poll, just show success message
        alert(response.message || "Vote submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting vote:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading poll...</p>;
  if (!poll) return null;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-md mb-6">
        <div className="text-2xl font-bold text-blue-600">CIVIX</div>
        <button
          onClick={() => navigate("/dashboard/citizen/polls")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back
        </button>
      </header>

      {/* Poll Card */}
      <main className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
        {poll.summary && <p className="text-gray-600 mb-2">{poll.summary}</p>}
        <p className="text-gray-500 text-sm mb-4">
          Posted: {new Date(poll.createdAt).toLocaleDateString()} • Responses: {totalVotes}
        </p>

        {!hasVoted ? (
          <div className="space-y-4">
            {poll.options.map((opt) => (
              <label key={opt._id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="pollOption"
                  value={opt.optionText}
                  checked={selectedOption === opt.optionText}
                  onChange={(e) => setSelectedOption(e.target.value)}
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
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Results & Live Sentiment:</h3>
            {poll.options.map((opt) => {
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
                      className={`h-4 rounded`}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: opt.optionText === "Yes" ? "#4caf50" : "#f44336",
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
            <p className="text-gray-500 text-sm mt-4">Total Votes: {totalVotes}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PollVotingPage;


