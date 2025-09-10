import React from 'react';

const categories = [
  'All Categories',
  'Environment',
  'Infrastructure',
  'Education',
  'Public Safety',
  'Transportation',
  'Healthcare',
  'Housing'
];

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
      <select
        value={selected}
        onChange={e => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
