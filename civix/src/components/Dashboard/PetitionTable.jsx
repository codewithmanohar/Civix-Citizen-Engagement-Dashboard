import React from "react";

export default function PetitionTable({ petitions, showActions = false }) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-blue-100">
          <th className="px-4 py-2 text-left">Title</th>
          <th className="px-4 py-2 text-left">Category</th>
          <th className="px-4 py-2 text-left">Signatures</th>
          <th className="px-4 py-2 text-left">Status</th>
          {showActions && <th className="px-4 py-2 text-left">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {petitions.map((petition, index) => (
          <tr key={index} className="border-b">
            <td className="px-4 py-2">{petition.title}</td>
            <td className="px-4 py-2">{petition.category}</td>
            <td className="px-4 py-2">{petition.signatures}</td>
            <td className="px-4 py-2">{petition.status}</td>
            {showActions && (
              <td className="px-4 py-2 space-x-2">
                <button className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                <button className="bg-blue-600 text-white px-2 py-1 rounded">Comment</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
