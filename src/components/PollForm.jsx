import React, { useState } from "react";
import "../App.css"; // go up one folder to access App.css

export default function PollForm() {
  const [poll, setPoll] = useState({
    title: "",
    description: "",
    option1: "",
    option2: "",
    location: "",
  });

  const handleChange = (e) => {
    setPoll({ ...poll, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Poll Submitted:", poll);
    alert("Poll Created Successfully!");
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Poll Creation</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={poll.title}
          onChange={handleChange}
          placeholder="Enter poll title"
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          value={poll.description}
          onChange={handleChange}
          placeholder="Enter description"
        />

        {/* Options */}
        <label>Options</label>
        <input
          type="text"
          name="option1"
          value={poll.option1}
          onChange={handleChange}
          placeholder="Option 1"
          required
        />
        <input
          type="text"
          name="option2"
          value={poll.option2}
          onChange={handleChange}
          placeholder="Option 2"
          required
        />

        {/* Location */}
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={poll.location}
          onChange={handleChange}
          placeholder="Enter location"
        />

        {/* Submit */}
        <button type="submit" className="submit-btn">
          Create poll
        </button>
      </form>
    </div>
  );
}
