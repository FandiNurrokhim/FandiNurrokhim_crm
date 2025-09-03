// src/components/DishCard.js
import React from 'react';

const DishCard = ({ name, price }) => {
  return (
    <div className="border rounded-lg p-3 m-2 text-center">
      <h3 className="text-md font-medium">{name}</h3>
      <p className="text-lg font-bold">${price}</p>
    </div>
  );
};

export default DishCard;