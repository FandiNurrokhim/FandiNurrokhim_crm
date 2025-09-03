import React, { useState } from "react";
import Rating from "../Atoms/Rating";

const RecipeCard = ({ recipe, isLoading }) => {
    const [showDetail, setShowDetail] = useState(false);

    if (isLoading) {
        return (
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="mt-4 h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-full"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        );
    }

    return (
        <>
            <div
                className="bg-white shadow-lg rounded-lg border border-gray-200 cursor-pointer"
                onClick={() => setShowDetail(true)}
            >
                <img
                    src={recipe.image || "https://placehold.co/600x400?text=No+Image"}
                    alt={recipe.name || "No name"}
                    onError={(e) => {
                        e.target.onerror = null; // prevent looping
                        e.target.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                    className="w-full h-48 object-cover rounded-t-lg"
                />

                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
                        <span className="bg-orange-100 text-orange-500 text-xs px-2 py-1 rounded-full">
                            {Array.isArray(recipe.categories) && recipe.categories.length > 0
                                ? recipe.categories.join(", ")
                                : "No category"}
                        </span>

                    </div>
                    <div className="mt-4 flex items-center text-gray-500">
                        <i className="fas fa-clock mr-2"></i>
                        <span>{recipe.time} mins</span>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Key Ingredients:</h4>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                            {recipe.ingredients.slice(0, 3).join(", ")}
                        </p>
                    </div>
                    <Rating rating={recipe.rating} userReviewCount={recipe.rating_count} />
                </div>
            </div>

            {showDetail && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full overflow-y-auto max-h-[90vh] p-6 relative">
                        <button
                            onClick={() => setShowDetail(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        >
                            &times;
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <img
                                    src={recipe.image || "https://placehold.co/600x400?text=No+Image"}
                                    alt={recipe.name || "No name"}
                                    onError={(e) => {
                                        e.target.onerror = null; // prevent looping
                                        e.target.src = "https://placehold.co/600x400?text=No+Image";
                                    }}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />

                            </div>
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
                                        <div className="mt-2 flex items-center text-gray-500">
                                            <i className="fas fa-clock mr-2"></i>
                                            <span>{recipe.time} mins</span>
                                            <span className="mx-2">•</span>
                                            <i className="fas fa-utensils mr-2"></i>
                                            <span>
                                                {Array.isArray(recipe.category)
                                                    ? recipe.category.join(", ")
                                                    : Array.isArray(recipe.categories)
                                                        ? recipe.categories.map((c) => c.name).join(", ")
                                                        : "Tidak ada kategori"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients</h3>
                                    <ul className="space-y-2">
                                        {recipe.ingredients.map((ing, index) => (
                                            <li key={`ingredient-${index}`} className="flex items-start">
                                                <input type="checkbox" className="mt-1 mr-3" />
                                                <span>{ing}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h3>
                                    <div className="prose max-w-none text-sm text-gray-700">
                                        {recipe.description || "No description available"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipeCard;
