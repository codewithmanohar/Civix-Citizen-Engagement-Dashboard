import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const OfficialPetitionCard = ({ petition }) => {
  const navigate = useNavigate();
  const [signatureCount, setSignatureCount] = useState(0);
  const goal = petition.signatureGoal || petition.target || 100;

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
    <div className="relative bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">{petition.title}</h2>

      {petition.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{petition.description}</p>
      )}

      <p className="text-sm text-gray-500 mb-1">Status: {petition.status}</p>
      <p className="text-sm text-gray-500 mb-3">
        Signatures: {signatureCount} / {goal}
      </p>

       
        <button
        onClick={() =>
          navigate(`/dashboard/official/petitions/view/${petition._id}`)
        }
         className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-600 shadow"
         
  >
          View Details
        </button>
      
    </div>
  );
};

export default OfficialPetitionCard;
