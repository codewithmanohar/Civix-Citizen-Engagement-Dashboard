import React from 'react';

const PetitionCard = ({ petition }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">{petition.title}</h2>
      {petition.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{petition.description}</p>
      )}
      <p className="text-sm text-gray-500 mb-1">Status: {petition.status}</p>
      <p className="text-sm text-gray-500 mb-3">Signatures: {petition.signatures} / {petition.target}</p>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">View Details</button>
        {petition.status === 'Active' && (
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Sign Petition</button>
        )}
      </div>
    </div>
  );
};

export default PetitionCard;
