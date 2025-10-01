import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetitionById } from "../lib/petitionService";
import api from "../lib/api"; // ✅ import your api wrapper

const ViewPetition = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Always pull logged-in user from localStorage
  const currentUser = {
    _id: localStorage.getItem("userId"),
    name: localStorage.getItem("name") || "User",
    role: localStorage.getItem("userRole") || "citizen",
    location: localStorage.getItem("location") || "Unknown",
  };

  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ signatures state
  const [signatureCount, setSignatureCount] = useState(0);
  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const data = await getPetitionById(id);
        setPetition(data);

        // ✅ fetch live signatures
        const res = await api.get(`/petition/signature/${id}`);
        setSignatureCount(res.data.total || 0);
        setSignatures(res.data.signatures || []);
      } catch (err) {
        console.error("Failed to fetch petition", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetition();
  }, [id]);

  if (loading) return <div className="p-8">Loading petition details...</div>;
  if (!petition) return <p className="text-center mt-10">Petition not found!</p>;

  const target = petition.signatureGoal || 100;
  const progress = (signatureCount / target) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      {/* Petition Info */}
      <h1 className="text-3xl font-bold mb-2">{petition.title}</h1>
      <p className="text-gray-600 mb-2">Category: {petition.category}</p>
      <p className="text-gray-600 mb-2">
        Location: {petition.location || "Not specified"}
      </p>
      <p className="text-gray-600 mb-4">
        Created by: {petition.createdBy?.name || "Unknown"}
      </p>
      <p className="mb-4">{petition.description}</p>
      <p className="text-sm text-gray-500 mb-1">Status: {petition.status}</p>
      {/* ✅ Live signature count */}
      <p className="text-sm text-gray-500 mb-4">
        Signatures: {signatureCount} / {target}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Back Button */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Back
        </button>
      </div>

      {/* Signed By */}
      {signatures.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Signed By:</h2>
          <ul className="list-disc list-inside">
            {signatures.map((sig, index) => (
              <li key={index}>
                {sig.user?.name || sig.user} (on{" "}
                {new Date(sig.signedAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share */}
      <div>
        <h2 className="font-semibold mb-2">Share:</h2>
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
