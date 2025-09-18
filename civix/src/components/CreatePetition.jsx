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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreatePetition() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    change: "",
    category: "",
    signatureGoal: 100,
    description: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentUser = localStorage.getItem("userEmail") || "current.user@example.com";
    
    const newPetition = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      status: "Active",
      signatures: 0,
      target: parseInt(formData.signatureGoal),
      signedBy: [],
      category: formData.category,
      location: "San Diego",
      createdBy: currentUser,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Add to localStorage
    const existingPetitions = JSON.parse(localStorage.getItem('petitions') || '[]');
    const updatedPetitions = [...existingPetitions, newPetition];
    localStorage.setItem('petitions', JSON.stringify(updatedPetitions));
    
    // Trigger update event
    window.dispatchEvent(new Event('petitionsUpdated'));
    
    toast.success("Petition created successfully!");
    navigate("/dashboard/citizen/petitions");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-8 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Create a New Petition
        </h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Petition Title */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Petition Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your petition a clear, specific title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
             focus:border-blue-200 focus:ring-0"
              required
            />
          </div>

          {/* Change */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Change
            </label>
            <input
              type="text"
              name="change"
              value={formData.change}
              onChange={handleInputChange}
              placeholder="State the change you want to see"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
             focus:border-blue-200 focus:ring-0"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Category
            </label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
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
              name="signatureGoal"
              value={formData.signatureGoal}
              onChange={handleInputChange}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
             focus:border-blue-200 focus:ring-0"
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Explain the issue, why it matters, and what action you want"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
             focus:border-blue-200 focus:ring-0 resize-none"
              required
            />
          </div>

          {/* Important Info */}
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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Petition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
