// src/components/Sidebar.js
import React from 'react';


const DishesCategory = ({ categories, selected, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-64 space-y-2 overflow-y-auto max-h-[90vh]">
      <h2 className="text-lg font-semibold">Dishes Category</h2>
      {categories.map((cat) => (
        <button
          key={cat.name}
          className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-100 transition ${
            selected === cat.name ? "bg-teal-100 border border-teal-500" : ""
          }`}
          onClick={() => onSelect(cat.name)}
        >
          <div className="flex items-center gap-2">
            <img src={cat.icon} alt="icon" className="w-5 h-5" />
            <span>{cat.name}</span>
          </div>
          <span className="text-sm text-gray-600">{cat.count}</span>
        </button>
      ))}
      <button className="w-full mt-4 bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600">
        + Add New Category
      </button>
    </div>
  );
};

export default DishesCategory;