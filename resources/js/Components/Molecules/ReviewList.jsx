import React from "react";

import ReviewCard from "@/Components/Atoms/ReviewCard";

// Skeleton loader untuk 7 review
function ReviewSkeleton() {
    return (
        <>
            {Array.from({ length: 7 }).map((_, idx) => (
                <article key={idx} className="flex space-x-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="flex space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-56"></div>
                        <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </div>
                </article>
            ))}
        </>
    );
}

// Komponen utama
export default function ReviewList({ reviews, isLoading }) {
    return (
        <section className="w-full space-y-10 max-h-[420px] overflow-y-auto pr-2">
            {isLoading ? (
                <ReviewSkeleton />
            ) : (
                reviews && reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                        <ReviewCard key={idx} review={review} />
                    ))
                ) : (
                    <div className="text-gray-500 text-sm">Belum ada review.</div>
                )
            )}
        </section>
    );
}