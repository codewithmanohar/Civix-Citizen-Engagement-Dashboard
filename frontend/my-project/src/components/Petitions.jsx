import React from "react";

export default function CreatePetition() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Create a New Petition</h1>

      <form className="space-y-6">
        {/* Petition Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Petition Title
          </label>
          <input
            type="text"
            placeholder="Give your petition a clear, specific title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Change */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Change
          </label>
          <input
            type="text"
            placeholder="State the change you want to see"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500">
            <option value="">Select a category</option>
            <option value="environment">Environment</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Signature Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signature Goal
          </label>
          <input
            type="number"
            defaultValue={100}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows="4"
            placeholder="Explain the issue, why it matters, and what action you want"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Important Information */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
          <strong>Important Information:</strong> By submitting this petition, you acknowledge that the content is factual to the best of your own knowledge.
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Petition
          </button>
        </div>
      </form>
    </div>
  );
}