import axios from "axios";

const POLLS_URL = "http://localhost:4000/api/polls";
const VOTES_URL = "http://localhost:4000/api/vote";

// Get poll by ID
export const getPollById = async (pollId) => {
  const { data } = await axios.get(`${POLLS_URL}/${pollId}`);
  return data;
};

// Submit a vote
export const votePoll = async (pollId, option) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("User not logged in");

  // Send the body with the field name exactly matching backend: { option }
  const { data } = await axios.post(
    `${VOTES_URL}/${pollId}`,
    { option },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // explicit content type
      },
    }
  );

  return data;
};
