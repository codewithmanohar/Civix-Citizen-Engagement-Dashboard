import React from "react";

export default function PetitionSearch({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search petitions..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border rounded mb-4"
    />
  );
}
