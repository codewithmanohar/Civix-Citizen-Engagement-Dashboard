import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SignPetition() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSign = async (e) => {
    e.preventDefault();

    if (!anonymous && name.trim() === "") {
      setError("Please enter your name or sign anonymously.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userEmail = localStorage.getItem('userEmail');
      const signatureData = {
        petitionId: parseInt(id),
        signerName: anonymous ? "Anonymous" : name,
        signerEmail: anonymous ? null : userEmail,
        comment: comment.trim() || null,
        isAnonymous: anonymous
      };

      try {
        // Try backend first
        const response = await fetch(`http://localhost:8080/api/petitions/${id}/sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signatureData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to sign petition');
        }

        const result = await response.json();
        console.log("Petition Signed via Backend ✅:", result);
      } catch (backendError) {
        // Fallback to localStorage if backend fails
        console.log('Backend unavailable, using localStorage fallback');
        
        // Update petition signatures in localStorage
        const petitions = JSON.parse(localStorage.getItem('petitions') || '[]');
        const petitionIndex = petitions.findIndex(p => p.id === parseInt(id));
        
        if (petitionIndex !== -1) {
          petitions[petitionIndex].signatures += 1;
          // Add user to signedBy array
          if (!petitions[petitionIndex].signedBy) {
            petitions[petitionIndex].signedBy = [];
          }
          if (!petitions[petitionIndex].signedBy.includes(userEmail)) {
            petitions[petitionIndex].signedBy.push(userEmail);
          }
          localStorage.setItem('petitions', JSON.stringify(petitions));
          // Trigger custom event to notify other components
          window.dispatchEvent(new Event('petitionsUpdated'));
        }
        
        console.log("Petition Signed via localStorage ✅:", signatureData);
      }

      alert("Thank you! You have successfully signed this petition.");
      navigate("/dashboard/citizen/petitions");
    } catch (error) {
      console.error('Error signing petition:', error);
      setError(error.message || 'Failed to sign petition. Please try again.');
    } finally {
      setLoading(false);
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
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Signing..." : "Confirm & Sign"}
          </button>
        </form>
      </div>
    </div>
  );
}
