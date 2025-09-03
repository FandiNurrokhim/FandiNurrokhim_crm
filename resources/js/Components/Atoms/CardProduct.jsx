import { useState, useRef, useEffect } from "react";
import Rating from "./Rating";
import axios from "axios";
import { getImageUrl } from "@/Utils/imageHelper";
import { Link, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Logo from "../../../../public/assets/Logo/Logo.jpg";
import { useTranslation } from "react-i18next";

export default function CardProduct({
    product,
    showFavorite = false,
    isFavorited = false,
    onRemove,
    favoriteDisplayOnly = false
}) {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    const [pending, setPending] = useState(false);
    const [internalIsFavorited, setInternalIsFavorited] = useState(isFavorited);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setInternalIsFavorited(isFavorited);
    }, [isFavorited]);

    const handleFavorite = () => {
        if (!auth || !auth.user) {
            window.setAuthModeState?.("login");
            window.setShowAuthModalState?.(true);
            return;
        }

        const nextFavorited = !isFavorited;
        setInternalIsFavorited(nextFavorited);

        if (!nextFavorited && typeof onRemove === "function") {
            onRemove(product.id);
        }
        if (nextFavorited) {
            toast.success(t("global.addedToFavorites"));
        } else {
            toast.info(t("global.removedFromFavorites"));
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setPending(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                axios.post(`/api/favorite`, { food_id: product.id });
            } catch (e) {
                setInternalIsFavorited((prev) => !prev);
                toast.error(t("global.errorAddFavorite"));
            } finally {
                setPending(false);
            }
        }, 800);
    };

    return (
        <div className="relative">
            <Link
                href={route("product.detail", { id: product.id })}
                className="bg-white h-full rounded-xl shadow cursor-pointer transition-transform duration-200 transform hover:scale-105 relative flex flex-col"
                style={{ overflow: "visible" }}
            >
                <img
                    alt={product.name}
                    className="w-full md:h-40 h-28 rounded-t-xl object-cover object-center"
                    height="180"
                    src={getImageUrl(product.image)}
                    width="320"
                />
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-xs md:text-md leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-gray-800 text-xs mb-2">
                        Rp. {Number(product.price).toLocaleString("id-ID")}
                    </p>
                    <Rating rating={product.rating} userReviewCount={product.rating_count} />
                </div>
            </Link>

            {showFavorite && (
                favoriteDisplayOnly ? (
                    <>
                        {isFavorited && (
                            <span
                                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                                title={isFavorited ? t("global.addedToFavorites") : t("global.addToFavorites")}
                            >
                                <HeartSolid className="w-4 h-4 text-red-500 fill-red-500" />
                            </span>
                        )}
                    </>
                ) : (
                    <button
                        onClick={handleFavorite}
                        disabled={pending}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition"
                        title={internalIsFavorited ? t("global.removeFromFavorites") : t("global.addToFavorites")}
                    >
                        {internalIsFavorited ? (
                            <HeartSolid className="w-4 h-4 text-red-500 fill-red-500" />
                        ) : (
                            <HeartOutline className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                )
            )}
        </div>
    );
}