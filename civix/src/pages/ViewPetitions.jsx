import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetitionById } from "../lib/petitionService";
import api from "../lib/api";

const ViewPetition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Logged-in citizen details
  const currentUser = {
    _id: localStorage.getItem("userId"),
    name: localStorage.getItem("name") || "User",
    role: localStorage.getItem("userRole") || "citizen",
    location: localStorage.getItem("location") || "Unknown",
  };

  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signatureCount, setSignatureCount] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [comments, setComments] = useState([]);

  // ---------------- FETCH PETITION + COMMENTS + SIGNATURES ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const petitionData = await getPetitionById(id);
        setPetition(petitionData);

        const sigRes = await api.get(`/petition/signature/${id}`);
        setSignatureCount(sigRes.data.total || 0);
        setSignatures(sigRes.data.signatures || []);

        // ✅ Fetch official comments from backend
        const commentRes = await api.get(`/comments/${id}`);
        setComments(commentRes.data || []);
      } catch (err) {
        console.error("Failed to load petition:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return <div className="p-8 text-center text-gray-600">Loading petition details...</div>;
  if (!petition) return <p className="text-center mt-10">Petition not found!</p>;

  const target = petition.signatureGoal || 100;
  const progress = (signatureCount / target) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      {/* Petition Info */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{petition.title}</h1>
      <p className="text-gray-600 mb-2">
        <strong>Category:</strong> {petition.category}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Location:</strong> {petition.location || "Not specified"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Created by:</strong> {petition.createdBy?.name || "Unknown"}
      </p>
      <p className="mb-4 text-gray-700 leading-relaxed">{petition.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        Status: <span className="font-medium text-gray-700">{petition.status}</span>
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Signatures: <span className="font-medium text-gray-700">{signatureCount}</span> / {target}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Back Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* ---------------- COMMENTS (from officials) ---------------- */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4 text-xl text-gray-800">
          Official Comments
        </h2>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-800">
                    {comment.user?.name || "Official"}
                  </p>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No official comments yet.
          </p>
        )}
      </div>

      {/* ---------------- SIGNATURES ---------------- */}
      {signatures.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3 text-lg text-gray-800">Signed By:</h2>
          <ul className="list-disc list-inside text-gray-700">
            {signatures.map((sig, i) => (
              <li key={i}>
                {sig.user?.name || sig.user} (on{" "}
                {new Date(sig.signedAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------- SHARE SECTION ---------------- */}
      <div>
        <h2 className="font-semibold mb-2 text-gray-800">Share:</h2>
        <div className="flex gap-3">
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Facebook
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}&text=${encodeURIComponent(petition.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600"
          >
            Twitter
          </a>

          {/* Email */}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
              "Check out this petition!"
            )}&body=${encodeURIComponent(
              (petition.title || "Interesting petition") +
                " - " +
                window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default ViewPetition;
