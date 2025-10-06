// /src/lib/reportService.js
import api from "./api"; // your existing axios wrapper

export const fetchPetitions = async () => {
  const res = await api.get("/petition");
  return res.data;
};

export const fetchPolls = async () => {
  const [activeRes, closedRes] = await Promise.all([
    api.get("/polls"),
    api.get("/polls/closed"),
  ]);

  // Use closedRes.data.polls instead of closedRes.data
  return [...activeRes.data, ...(closedRes.data.polls || [])];
};


export const fetchUsers = async () => {
  const token = localStorage.getItem("authToken");
  const res = await api.get("/auth/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
