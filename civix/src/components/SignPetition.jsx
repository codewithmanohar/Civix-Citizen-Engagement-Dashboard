import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SignPetition({ onSign }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSign = (e) => {
    e.preventDefault();

    if (!anonymous && name.trim() === "") {
      setError("Please enter your name or sign anonymously.");
      return;
    }

    setError("");

    // Call back to PetitionPage to update state
    onSign(parseInt(id), anonymous ? "Anonymous" : name);

    const signedData = {
      petitionId: id,
      name: anonymous ? "Anonymous" : name,
      comment,
      timestamp: new Date().toISOString(),
    };
    console.log("Petition Signed ✅:", signedData);

    alert("Thank you! You have successfully signed this petition.");
    navigate("/dashboard/citizen/petitions");
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
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0"
            />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Sign anonymously
          </label>

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
