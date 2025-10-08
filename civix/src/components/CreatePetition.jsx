import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPetition } from "../lib/petitionService";

export default function CreatePetition() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    change: "",
    category: "",
    goal: 100,
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPetition({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location || user.location || "Unknown", // fallback
      });

      alert("✅ Petition created successfully!");
      navigate("/dashboard/citizen/petitions"); // redirect to petitions list
    } catch (err) {
      alert("❌ Failed to create petition. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-8 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Create a New Petition
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Petition Title */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Petition Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your petition a clear, specific title"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0"
            />
          </div>

          {/* Change */}
          {/* <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Change
            </label>
            <input
              type="text"
              name="change"
              value={form.change}
              onChange={handleChange}
              placeholder="State the change you want to see"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0"
            />
          </div> */}

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Transportation">Transportation</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Housing">Housing</option>
            </select>
          </div>

          {/* Signature Goal */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Signature Goal
            </label>
            <input
              type="number"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0"
            />
          </div>

          {/* Location */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, State, or Region"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0"
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Explain the issue, why it matters, and what action you want"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-200 focus:ring-0 resize-none"
            />
          </div>

          {/* Info */}
          <div className="col-span-2 bg-blue-50 border-l-4 border-blue-500 text-gray-700 p-4 rounded-lg">
            <strong className="block mb-1">Important Information:</strong>
            <span>
              By submitting this petition, you confirm the content is factual to the best of your knowledge.
            </span>
          </div>

          {/* Submit */}
          <div className="col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Petition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
