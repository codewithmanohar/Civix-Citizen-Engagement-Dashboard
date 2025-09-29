import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const PetitionCard = ({ petition, selectedTab, currentUser, mySignedPetitions }) => {
  const navigate = useNavigate();
  const [signatureCount, setSignatureCount] = useState(0);
  const goal = petition.signatureGoal || petition.target || 100;

  // Disable sign if:
  // - Tab is "mine" or "signed"
  // - Created by current user
  // - Already signed by current user
  const disableSign =
    selectedTab === "mine" ||
    selectedTab === "signed" ||
     petition.createdBy?.name === currentUser || // compare by name
  (mySignedPetitions || []).some((p) => p && p._id === petition._id);

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await api.get(`/petition/signature/${petition._id}`);
        setSignatureCount(res.data.total);
      } catch (err) {
        console.error("Error fetching signatures", err);
      }
    };
    fetchSignatures();
  }, [petition._id]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">{petition.title}</h2>

      {petition.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{petition.description}</p>
      )}

      <p className="text-sm text-gray-500 mb-1">Status: {petition.status}</p>
      <p className="text-sm text-gray-500 mb-3">
        Signatures: {signatureCount} / {goal}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/dashboard/citizen/view/${petition._id}`)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          View Details
        </button>

        <button
          onClick={() =>
            !disableSign && navigate(`/dashboard/citizen/sign/${petition._id}`)
          }
          disabled={disableSign}
          className={`px-3 py-1 text-sm rounded transition ${
            disableSign
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Sign Petition
        </button>
      </div>
    </div>
  );
};

export default PetitionCard;
