// src/PollVotingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/Pollsvotingpage.css";

const PollVotingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem("civix_polls") || "[]");
    const pollId = parseInt(id, 10);

    // Prefer poll passed via state
    const currentPoll = location.state?.poll || storedPolls.find((p) => p.id === pollId);

    if (currentPoll) {
      setPoll(currentPoll);

      // Initialize vote counts
      const initialVotes = {};
      currentPoll.options.forEach((opt) => {
        initialVotes[opt] = currentPoll.voteCounts?.[opt] || 0;
      });
      setVotes(initialVotes);

      // Determine if user has already voted
      const votedPolls = JSON.parse(localStorage.getItem("civix_voted") || "[]");
      if (votedPolls.includes(pollId) || currentPoll.status === "Closed Polls") {
        setHasVoted(true);
      }
    } else {
      navigate("/polls");
    }
  }, [id, location.state, navigate]);

  const handleVote = () => {
    if (!selectedOption) return alert("Please select an option!");

    const updatedVotes = { ...votes };
    updatedVotes[selectedOption] += 1;
    setVotes(updatedVotes);
    setHasVoted(true);

    // Update poll in localStorage
    const storedPolls = JSON.parse(localStorage.getItem("civix_polls") || "[]");
    const pollIndex = storedPolls.findIndex((p) => p.id === poll.id);
    storedPolls[pollIndex].voteCounts = updatedVotes;
    storedPolls[pollIndex].responses = Object.values(updatedVotes).reduce((a, b) => a + b, 0);
    localStorage.setItem("civix_polls", JSON.stringify(storedPolls));

    // Mark as voted
    const votedPolls = JSON.parse(localStorage.getItem("civix_voted") || "[]");
    if (!votedPolls.includes(poll.id)) {
      localStorage.setItem("civix_voted", JSON.stringify([...votedPolls, poll.id]));
    }
  };

  if (!poll) return null;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="civix">
      <header className="civix-header">
        <div className="header-left"><div className="logo">CIVIX</div></div>
        <div className="header-right">
          <button className="signout" onClick={() => navigate("/polls")}>Back</button>
        </div>
      </header>

      <div className="civix-body">
        <main className="main-content poll-vote-main">
          <div className="poll-vote-card">
            <h2 className="poll-title">{poll.title}</h2>
            <p className="poll-summary">{poll.summary}</p>
            <p className="poll-meta">
              Posted: {poll.date} â€¢ Responses: {poll.responses}
            </p>

            {!hasVoted ? (
              <div className="options-list">
                {poll.options.map((opt, i) => (
                  <label key={i} className="option-label">
                    <input
                      type="radio"
                      name="pollOption"
                      value={opt}
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(opt)}
                    />
                    {opt}
                  </label>
                ))}
                <button className="create-btn vote-now-btn" onClick={handleVote}>
                  Submit Vote
                </button>
              </div>
            ) : (
              <div className="results-section">
                <h3>Results & Live Sentiment:</h3>
                {poll.options.map((opt, i) => {
                  const percentage = totalVotes ? ((votes[opt] / totalVotes) * 100).toFixed(1) : 0;
                  return (
                    <div key={i} className="result-row">
                      <span className="option-text">{opt}</span>
                      <div className="result-bar-container">
                        <div
                          className="result-bar"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: opt === "Yes" ? "#4caf50" : "#f44336"
                          }}
                        ></div>
                      </div>
                      <span className="percentage-text">{percentage}% ({votes[opt]})</span>
                    </div>
                  );
                })}
                <p className="total-votes">Total Votes: {totalVotes}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PollVotingPage;
