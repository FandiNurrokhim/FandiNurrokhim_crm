import React from "react";

const ReviewCard = ({ review }) => (
    <article className="flex space-x-4">
        {review.user.photo_profile ? (
            <img
                alt={review.user.name}
                className="w-12 h-12 rounded-full object-cover"
                height="48"
                src={review.user.photo_profile}
                width="48"
            />
        ) : (
            <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                    {review.user.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                </span>
            </div>
        )}
        <div>
            <h4 className="font-semibold text-sm mb-1">
                {review.user.name}
            </h4>
            <div className="flex text-yellow-400 text-base mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <i
                        key={i}
                        className={
                            i < Math.round(review.rating)
                                ? "fas fa-star"
                                : "far fa-star text-gray-300"
                        }
                    ></i>
                ))}
            </div>
            <p className="italic text-sm text-gray-700 max-w-xl">
                {review.comment}
            </p>
        </div>
    </article>
);

export default ReviewCard;