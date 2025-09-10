import React from "react";

const categories = ["All", "Education", "Infrastructure", "Environment", "Public Safety"];

export default function CategoryTabs({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-3 py-1 rounded ${
            selectedCategory === cat ? "bg-blue-900 text-white" : "bg-blue-100 text-blue-900"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
