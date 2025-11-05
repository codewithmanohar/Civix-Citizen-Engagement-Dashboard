import React from "react";
import { useNavigate } from "react-router-dom";

export default function UnderProcess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        🚧 Page Under Process
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        This feature is currently under development. Please check back later!
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </button>
    </div>
  );
}
