import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { router, usePage } from "@inertiajs/react";
import 'keen-slider/keen-slider.min.css';

import React from "react";

import CardProduct from "@/Components/Atoms/CardProduct";
import CardProductSliderSkeleton from "@/Components/Atoms/CardProductSliderSkeleton";
import EmptyProductPlaceholder from "@/Components/Atoms/EmptyProductPlaceholder";

export default function ProductSliderSection({ products = [], title, imageUrl, isLoading, isRecommendationType = true }) {
    const [sliderRef, slider] = useKeenSlider({
        mode: "free-snap",
        slides: {
            perView: 4.5,
            spacing: 15,
        },
        breakpoints: {
            "(max-width: 1200px)": {
                slides: {
                    perView: 3.5,
                    spacing: 15,
                },
            },
            "(max-width: 900px)": {
                slides: {
                    perView: 2.5,
                    spacing: 15,
                },
            },
            "(max-width: 600px)": {
                slides: {
                    perView: 1.8,
                    spacing: 15,
                },
            },
        },
    });

    const banners = usePage().props.banners || [];
    const sliderBanners = banners.filter(b => b.type === "slider");

    const fallbackBannerName = isRecommendationType ? 'recommendation' : 'our_choice';

    const matchedBanner = sliderBanners.find(
        b => b.title === `${fallbackBannerName}`
    );

    const finalImageUrl = matchedBanner?.image || `banner_${fallbackBannerName}`;

    const handleClick = (productId) => {
        router.get(`/product/${productId}`);
    };

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 font-semibold text-lg">
                    {title}
                </h2>
            </div>
            {isLoading ? (
                <CardProductSliderSkeleton />
            ) : products.length === 0 ? (
                <EmptyProductPlaceholder />
            ) : (
                <div className="flex items-start">
                    <div className="md:w-56 w-20 hidden sm:block mr-4">
                        <BannerPromoSection imageUrl={finalImageUrl} />
                    </div>

                    {/* Slider */}
                    <div className="w-full overflow-hidden" ref={sliderRef}>
                        <div className="keen-slider cursor-grab">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="keen-slider__slide py-2"
                                    onClick={() => handleClick(product.id)}
                                >
                                    <CardProduct key={product.id} product={product} isFavorited={product.isFavorite} favoriteDisplayOnly={true} showFavorite={true} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            )}
        </section>
    );
}

import { getImageUrl } from "@/Utils/imageHelper";

const BannerPromoSection = ({ imageUrl = null }) => {
    const [imgError, setImgError] = useState(false);

    const finalUrl = imageUrl && !imgError ? getImageUrl(imageUrl) : null;

    const fallback = (
        <div className="w-full h-full bg-[#0E1C2D] flex items-center justify-center">
            <span className="text-white font-semibold text-center px-2">
                Pundensari Food
            </span>
        </div>
    );

    return (
        <div className="w-56 h-80 lg:flex border rounded-lg overflow-hidden items-center justify-center">
            {finalUrl ? (
                <img
                    src={finalUrl}
                    alt="Promo Banner"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            ) : (
                fallback
            )}
        </div>
    );
};