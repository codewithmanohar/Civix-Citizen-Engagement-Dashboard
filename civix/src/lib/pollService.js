import axios from "axios";

const POLLS_URL = "http://localhost:4000/api/polls";
const VOTES_URL = "http://localhost:4000/api/vote";

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
