import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Review from "@/Components/Organisms/Review";
import { useTranslation } from "react-i18next";
import ButtonFavorite from "@/Components/Atoms/ButtonFavorite";
import Rating from "@/Components/Atoms/Rating";
import ProductIngredients from "@/Components/Molecules/ProductIngredients";
import LimitedText from "../Atoms/LimitedText";


function ProductTabs({ product }) {
    const [activeTab, setActiveTab] = useState("detail");
    const reviews = usePage().props.reviews;
    const summary = usePage().props.summary;
    const userReview = usePage().props.userReview;
    const isFavorited = usePage().props.isFavorited;
    const { t, i18n } = useTranslation();

    const description = i18n.language === "en"
        ? product.description_en
        : product.description_id;

    return (
        <div
            className="bg-white max-w-7xl pb-20 mx-auto rounded-t-3xl shadow-lg px-7 pt-8"
            style={{ marginTop: '-30px' }}
        >
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mb-6 relative bg-white">
                <button
                    className={`py-2 px-4 text-sm font-semibold text-gray-700 border-b-2 border-transparent cursor-pointer focus:outline-none transition-colors duration-200 ${activeTab === "detail" ? "active-tab border-b-green-600 text-green-700" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("detail")}
                >
                    Detail
                </button>
                <button
                    className={`py-2 px-4 text-sm font-semibold text-gray-700 border-b-2 border-transparent cursor-pointer focus:outline-none transition-colors duration-200 ${activeTab === "bahan" ? "active-tab border-b-green-600 text-green-700" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("bahan")}
                >
                    {t("home.ingredients")}
                </button>
            </div>
            {/* Tabs Content */}
            {activeTab === "detail" && (
                <div className="tab-content">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {product.name}
                        </h1>
                        <Rating rating={product.average_rating} userReviewCount={product.rating_count} />
                        <p className="text-green-600 font-semibold text-sm">
                            {product.portion_info}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-7">
                        <p className="text-2xl font-semibold text-gray-900">
                            Rp. {Number(product.price).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <LimitedText text={description} limit={50} />
                    <Review productId={product.id} initialReviews={reviews} summary={summary} userReview={userReview} />
                    <div className="flex items-center justify-between mt-7">
                        <ButtonFavorite
                            product={product}
                            isFavorited={isFavorited}
                        />
                    </div>
                </div>
            )}
            {activeTab === "bahan" && (
                <ProductIngredients ingredients={product.ingredients} />
            )}
        </div>
    );
}

export default ProductTabs;