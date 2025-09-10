import React, { useState } from "react";

function PetitionForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    goal: 100,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict Title: only letters, spaces, and punctuation
    if (name === "title" && /[^a-zA-Z\s.,!?]/.test(value)) {
      return; // block invalid input
    }

    // Restrict Goal: only digits allowed
    if (name === "goal") {
      if (!/^\d*$/.test(value)) return; // ignore non-digits
    }

    // ✅ Description: allow everything (no restriction)
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extra validation
    if (!formData.title.trim()) {
      alert("Title cannot be empty and must contain valid text.");
      return;
    }

    if (isNaN(parseInt(formData.goal))) {
      alert("Signature Goal must be an integer value.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    alert("Petition Submitted: " + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* Petition Title */}
        <label>Petition Title</label>
        <input
          type="text"
          name="title"
          placeholder="Give your petition a clear, specific title."
          value={formData.title}
          onChange={handleChange}
          required
        />
        <small>Choose a title that clearly states what changes you want to see.</small>

        {/* Category */}
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="environment">Environment</option>
          <option value="education">Education</option>
          <option value="health">Health</option>
          <option value="community">Community</option>
        </select>

        {/* Signature Goal */}
        <label>Signature Goal</label>
        <input
          type="text"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        />
        <small>How many signatures are you aiming to collect?</small>

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Describe the issue and the change you’d like to see..."
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <small>
          Clearly explain the issue, why it matters, and what specific action
          you’re requesting.
        </small>

        {/* Important Info */}
        <div className="important-box">
          <strong>Important Information</strong>
          <p>
            By submitting this petition, <b>you</b> acknowledge that the content
            is factual to the best of your own knowledge.
          </p>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Submit Petition
        </button>
      </form>
    </div>
  );
}

export default PetitionForm;
