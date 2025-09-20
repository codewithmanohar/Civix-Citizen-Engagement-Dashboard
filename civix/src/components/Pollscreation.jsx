// src/PollCreationPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function PollCreationPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [targetLocation, setTargetLocation] = useState("San Diego");
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => setOptions([...options, `Option ${options.length + 1}`]);

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = async () => {
    if (!title.trim() || options.some((opt) => !opt.trim())) return;
    setLoading(true);

    try {
      await api.post("/polls/create", { title, options, targetLocation });
      navigate("/polls");
    } catch (err) {
      console.error("Error creating poll:", err.response?.data || err.message);
      alert("Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8 border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Create a New Poll</h1>
          <button
            onClick={() => navigate("/polls")}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Poll Title</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Target Location</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
            >
              <option value="AP">AP</option>
              <option value="San Diego">San Diego</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Orange County">Orange County</option>
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  type="text"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="text-red-600 hover:scale-110 transition"
                    onClick={() => handleRemoveOption(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={handleAddOption}
            >
              + Add Option
            </button>
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handleCreatePoll}
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
