import React from "react";

export default function Polls() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Create a Poll</h1>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter poll title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows="3"
            placeholder="Describe your poll"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Option 1"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Option 2"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Enter location"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create poll
          </button>
        </div>
      </form>
    </div>
  );
}