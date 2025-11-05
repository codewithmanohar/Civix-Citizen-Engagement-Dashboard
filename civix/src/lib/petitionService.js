
import axios from "axios";
import api from "./api";

const API_URL = "https://civix-backend-8k3m.onrender.com/api/petition";

// Fetch all petitions
export async function getAllPetitions() {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response from backend:", errorText);
    throw new Error("Failed to fetch petitions");
  }
  return response.json();
}

// Fetch single petition
export const getPetitionById = async (id) => {
  const res = await api.get(`/petition/${id}`);
  return res.data;
};

// ✅ Fetch petitions signed by the logged-in user

export const getMySignedPetitions = async () => {
  try {
    const res = await api.get("/petition/my-signed");
    return res.data;
  } catch (err) {
    console.error("Error fetching signed petitions:", err.response?.data || err.message);
    throw err;
  }
};

// Sign a petition
export const signPetition = async (id, { name, comment }) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No JWT token found. Please login.");

  const res = await api.post(`petition/sign/${id}`,{ name, comment });

  return res.data;
};


// Create a new petition
export const createPetition = async (petitionData) => {
  try {
    const res = await api.post("/petition/create", petitionData);
    return res.data;
  } catch (err) {
    console.error("Create petition error:", err.response?.data || err.message);
    throw err;
  }
};
