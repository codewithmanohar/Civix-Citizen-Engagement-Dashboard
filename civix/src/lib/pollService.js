import axios from "axios";

const POLLS_URL = "https://civix-backend-8k3m.onrender.com/api/polls";
const VOTES_URL = "https://civix-backend-8k3m.onrender.com/api/vote";

// Get poll by ID
export const getPollById = async (pollId) => {
  const token = localStorage.getItem("authToken");
  // Always send token if available
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    const { data } = await axios.get(`${POLLS_URL}/${pollId}`, { headers });
    return data;
  } catch (err) {
    console.error("Error fetching poll:", err.response?.data || err.message);
    throw err;
  }
};

// Submit a vote
export const votePoll = async (pollId, option) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("User not logged in");

  try {
    const { data } = await axios.post(
      `${VOTES_URL}/${pollId}`,
      { option },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    console.error("Error submitting vote:", err.response?.data || err.message);
    throw err;
  }
};

// Remove all votes by user ID
export const removeUserVotes = async (userId) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("User not logged in");

  try {
    const { data } = await axios.delete(
      `${VOTES_URL}/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.error("Error removing user votes:", err.response?.data || err.message);
    throw err;
  }
};


