import React from "react";
import { useParams } from "react-router-dom";

const petition = {
  id: 2,
  title: "Request for Funding for Local Park Renovation Project",
  category: "Environment",
  createdBy: "Green City Initiative",
  signatures: "8,765",
  goal: "10,000",
  date: "2023-11-05",
  status: "Pending",
  comments: [
    { name: "Emily Johnson", time: "5 hours ago", text: "The park is a vital part of our neighborhood. We need to protect it." },
    { name: "Tom Williams", time: "1 day ago", text: "I will spread the word on social media." },
  ],
  updates: [
    { author: "Green City Initiative", time: "3 hours ago", text: "We’ve reached 8,000 signatures. Thank you!" },
  ],
};

export default function OfficialPetitionView() {
  const { id } = useParams();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">{petition.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Category:</strong> {petition.category}</p>
          <p><strong>Created By:</strong> {petition.createdBy}</p>
          <p><strong>Signatures:</strong> {petition.signatures} / {petition.goal}</p>
          <p><strong>Date:</strong> {petition.date}</p>
          <p><strong>Status:</strong> {petition.status}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Post an Update</h2>
          <textarea
            rows="4"
            placeholder="Write an update..."
            className="w-full border rounded p-2 mb-2"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Post Update</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Supporter Comments</h2>
          <ul className="space-y-2 text-sm">
            {petition.comments.map((c, idx) => (
              <li key={idx}>
                <strong>{c.name}</strong> <span className="text-gray-500">({c.time})</span>: {c.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Updates</h2>
          <ul className="space-y-2 text-sm">
            {petition.updates.map((u, idx) => (
              <li key={idx}>
                <strong>{u.author}</strong> <span className="text-gray-500">({u.time})</span>: {u.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Share This Petition</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Facebook</button>
          <button className="px-4 py-2 bg-sky-500 text-white rounded">Twitter</button>
          <button className="px-4 py-2 bg-gray-400 text-white rounded">Email</button>
        </div>
      </div>
    </div>
  );
}