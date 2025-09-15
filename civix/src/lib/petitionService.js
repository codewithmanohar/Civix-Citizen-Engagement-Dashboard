/*import axios from "axios";
import api from "./api"; 

const API_URL = "http://localhost:4000/api/petition";

// Fetch all petitions
// Fetch all petitions from backend
export async function getAllPetitions() {
  const token = localStorage.getItem("authToken"); 
  console.log("JWT token being sent:", token);// match LoginForm
  const response = await fetch("http://localhost:4000/api/petition", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // If backend expects cookies
  });
  if (!response.ok) {
  const errorText = await response.text();
  console.log("Error response from backend:", errorText);
  throw new Error("Failed to fetch petitions");
}
  return response.json();
}

// Sign a petition
export const signPetition = async (id) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No JWT token found. Please login.");

  const res = await axios.post(
    `${API_URL}/sign/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // will include { message, signature, petition, total }
};
export const createPetition = async (petitionData) => {
  try {
    const res = await api.post("/petition/create", petitionData);
    return res.data;
  } catch (err) {
    console.error("Create petition error:", err.response?.data || err.message);
    throw err;
  }
};
// Get single petition
export const getPetitionById = async (id) => {
  const res = await api.get(`/petition/${id}`);
  return res.data;
};*/
import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:4000/api/petition";

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

// Sign a petition
/*export const signPetition = async (id) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No JWT token found. Please login.");

  const res = await axios.post(
    `${API_URL}/sign/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};*/
// petitionService.jsx
export const signPetition = async (id) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No JWT token found. Please login.");

  const res = await axios.post(
    `${API_URL}/sign/${id}`,
    {}, // <-- send data (name, comment, anonymous)
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // { message, signature, petition, total }
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
