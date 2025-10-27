import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { signPetition } from "../lib/petitionService";

export default function SignPetition({ onSign }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState(localStorage.name || "");
  const [anonymous, setAnonymous] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
const location = useLocation(); 
const handleSign = async (e) => {
  e.preventDefault();

  try {
    const res = await signPetition(id, { name, comment }); // ✅ correct usage

    if (res) {
      alert("Thank you! You have successfully signed this petition.");
      const fromDashboard =
          new URLSearchParams(location.search).get("from") === "Dashboard";

      if (fromDashboard) {
        navigate("/dashboard/citizen"); // redirect to dashboard ✅
      } else {
      navigate("/dashboard/citizen/petitions");
      }
    }
  } catch (error) {
    setError(error.response?.data?.message || "Error signing petition");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen px-4">
  <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Sign This Petition
        </h2>

        <form onSubmit={handleSign} className="space-y-4">
          {!anonymous && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              disabled
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0"
            />
          )}

          {/* <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setName("anonymous")}
            />
            Sign anonymously
          </label> */}

          <textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0 resize-none"
            rows="3"
            maxLength={250}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Confirm & Sign
          </button>
        </form>
      </div>
    </div>
  );
}