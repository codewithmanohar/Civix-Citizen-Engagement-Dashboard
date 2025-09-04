/*import React from "react";

export default function CreatePetition() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Create a New Petition
        </h1>

        <form className="space-y-5">
          {/* Petition Title }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Petition Title
            </label>
            <input
              type="text"
              placeholder="Give your petition a clear, specific title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Change *}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change
            </label>
            <input
              type="text"
              placeholder="State the change you want to see"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category *}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
              <option value="">Select a category</option>
              <option value="environment">Environment</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Signature Goal *}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Signature Goal
            </label>
            <input
              type="number"
              defaultValue={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description *}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Explain the issue, why it matters, and what action you want"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Important Info *}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg">
            <strong>Important Information:</strong> By submitting this petition,
            you acknowledge that the content is factual to the best of your own
            knowledge.
          </div>

          {/* Submit *}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Petition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}*/
import React from "react";

export default function CreatePetition() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-brand-dark">
        <h1 className="text-3xl font-bold text-center text-brand-dark mb-8">
          Create a New Petition
        </h1>

        <form className="space-y-6">
          {/* Petition Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Petition Title
            </label>
            <input
              type="text"
              placeholder="Give your petition a clear, specific title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Change */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Change
            </label>
            <input
              type="text"
              placeholder="State the change you want to see"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Category
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent">
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
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Signature Goal
            </label>
            <input
              type="number"
              defaultValue={100}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Explain the issue, why it matters, and what action you want"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Important Info - Updated Style */}
          <div className="bg-brand-accent/10 border-l-4 border-brand-accent text-brand-dark p-4 rounded-lg">
            <strong className="block mb-1">Important Information:</strong>
            <span>
              By submitting this petition, you confirm the content is factual to the best of your knowledge.
            </span>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-brand-accent text-white px-6 py-2 rounded-lg hover:bg-brand-accent-dark transition"
            >
              Submit Petition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

