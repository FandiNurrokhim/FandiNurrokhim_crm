import React from "react";

export default function SelectBox({ label, options = [], value, onChange }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <select
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        value={value}
        onChange={onChange}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}