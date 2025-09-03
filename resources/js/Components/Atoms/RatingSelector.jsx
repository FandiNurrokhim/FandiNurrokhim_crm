import React from "react";
import { useTranslation } from "react-i18next";

export default function RatingSelector({ selectedRating, onChange, disabled }) {
  const options = [4, 3, 2];
  const { t } = useTranslation();

  const handleChange = (rating) => {
    if (selectedRating === rating) {
      onChange(null);
    } else {
      onChange(rating);
    }
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2">Rating</p>
      {options.map((rating) => (
        <label key={rating} className="flex items-center mb-1 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={selectedRating === rating}
            onChange={() => handleChange(rating)}
            disabled={disabled}
          />
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) =>
              i <= rating ? (
                <i key={`full-${i}`} className="fas fa-star text-yellow-400"></i>
              ) : (
                <i key={`empty-${i}`} className="far fa-star text-gray-300"></i>
              )
            )}
            <span className="ml-2 text-sm text-gray-600">{rating}.0 & {t("global.up")}</span>
          </div>
        </label>
      ))}
    </div>
  );
}