import React from "react";

const AirbnbCard = ({
  image,
  isFavorite = true,
  badgeIcon,
  title,
  location,
  distance,
  dateRange,
  price,
  rating,
}) => {
  return (
    <div className="w-72 rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        {isFavorite && (
          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow">
            {badgeIcon && <span className="mr-1">{badgeIcon}</span>}
            Guest favorite
          </div>
        )}
        <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{distance}</p>
        <p className="text-sm text-gray-500">{dateRange}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold">{price}<span className="text-xs font-normal"> / night</span></p>
          <div className="flex items-center gap-1 text-sm">
            <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirbnbCard;
