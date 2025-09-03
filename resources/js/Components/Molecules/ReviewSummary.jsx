import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

import { useTranslation } from "react-i18next";
import ReviewCard from "../Atoms/ReviewCard";
import AuthModal from "@/Components/Organisms/AuthModal";
import ReviewModal from "@/Components/Molecules/ReviewModal";

// Skeleton Loader
function ReviewSummarySkeleton() {
    return (
        <section className="md:w-1/3 animate-pulse">
            <div className="h-5 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="flex items-center space-x-2 mb-3">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3 mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-300 rounded w-full"></div>
            </div>
        </section>
    );
}

// Komponen utama
export default function ReviewSummary({ isLoading, summary, userReview }) {
    const { t } = useTranslation();
    const auth = usePage().props.auth.user;
    const productId = usePage().props.product.id;

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [showModal, setShowModal] = useState(false);

    const total = summary?.total || 0;
    const average = summary?.average || 0;
    const breakdown = summary?.breakdown && summary.breakdown.length === 5
        ? summary.breakdown
        : [5, 4, 3, 2, 1].map(star => ({ star, percent: 0 }));

    const handleWriteReview = () => {
        if (!auth || !auth.id) {
            setAuthMode("login");
            setShowAuthModal(true);
        } else {
            setShowModal(true);
        }
    };

    return isLoading ? (
        <ReviewSummarySkeleton />
    ) : (
        <section className="w-full">
            <h2 className="font-semibold text-lg mb-2">
                {t("home.reviewSummary")}
            </h2>
            <div className="flex items-center space-x-1 mb-1">
                <div className="flex text-yellow-400 text-base">
                    <div className="flex text-base gap-1">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className={
                                    summary && total > 0 && i < Math.round(average)
                                        ? "fas fa-star text-yellow-400"
                                        : "far fa-star text-gray-300"
                                }
                            ></i>
                        ))}
                    </div>
                </div>
                <span className="text-xs text-gray-700">
                    {t("home.basedOn")} {total} {t("home.reviews")}
                </span>
            </div>

            <div className="space-y-2 mb-6 mt-3">
                {breakdown.map((item) => (
                    <div key={item.star} className="flex items-center text-sm font-semibold">
                        <span className="w-5">{item.star}</span>
                        <i
                            className={`fas fa-star w-4 ${summary && total > 0 ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                        ></i>
                        <div className="h-3 rounded-full bg-gray-200 mx-3 flex-1">
                            <div
                                className="h-3 rounded-full bg-yellow-400"
                                style={{ width: `${item.percent}%` }}
                            ></div>
                        </div>
                        <span className="w-8 text-right">{item.percent}%</span>
                    </div>
                ))}
            </div>

            {userReview ? (
                <ReviewCard review={userReview} />
            ) : (
                <div>
                    <h3 className="font-semibold mb-1 text-sm">
                        {t("home.shareYourThought")}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                        {t("home.shareExperience")}
                    </p>
                    <button
                        className="w-full border border-gray-300 rounded-md py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                        type="button"
                        onClick={handleWriteReview}
                    >
                        {t("home.writeReview")}
                    </button>
                    <AuthModal
                        isOpen={showAuthModal}
                       onClose={() => setShowAuthModal(false)}
                        defaultMode={authMode}
                    />
                </div>
            )}

            <ReviewModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                productId={productId}
            />

        </section>
    );
}