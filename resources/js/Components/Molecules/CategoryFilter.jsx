import React from "react";
import Chip from "../Atoms/Chip";

const CategoryFilter = ({ categories, onSelect }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
                <Chip
                    key={index}
                    className="bg-white text-orange-500 hover:bg-orange-100 hover:cursor-pointer"
                    onClick={() => onSelect(category)}
                >
                    {category}
                </Chip>
            ))}
        </div>
    );
};

export default CategoryFilter;
