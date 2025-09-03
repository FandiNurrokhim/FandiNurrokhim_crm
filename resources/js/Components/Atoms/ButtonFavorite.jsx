import React, { useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import AuthModal from "@/Components/Organisms/AuthModal";

export default function ButtonFavorite({ product, isFavorited: initialFavorited = false }) {
    const { t } = useTranslation();

    const auth = usePage().props.auth;

    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [pending, setPending] = useState(false);
    const REQUIRED_CATEGORIES = ['Makanan', 'Minuman', 'Kudapan'];
    const [showAuthModal, setShowAuthModalState] = useState(false);
    const [authMode, setAuthModeState] = useState("login");
    const timeoutRef = useRef(null);

    const handleFavorite = () => {
        if (!auth || !auth.user) {
            setAuthModeState("login");
            setShowAuthModalState(true);
            return;
        }

        const nextFavorited = !isFavorited;
        setIsFavorited(nextFavorited);

        if (nextFavorited) {
            toast.success(t("global.addedToFavorites"));
            updatePreferences(product);
        } else {
            toast.info(t("global.removedFromFavorites"));
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setPending(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                axios.post(`/api/favorite`, { food_id: product.id });
            } catch (e) {
                setIsFavorited((prev) => !prev);
                toast.error(t("global.errorAddFavorite"));
            } finally {
                setPending(false);
            }
        }, 800);
    };

    const updatePreferences = (food) => {
        if (!food) return;

        if (!localStorage.getItem("preferences") && auth && auth.user) {
            axios.get("/api/user-preferences").then(res => {
                localStorage.setItem("preferences", JSON.stringify(res.data));
            });
        }

        const storedPreferences = JSON.parse(localStorage.getItem("preferences")) || {
            categories: [],
            ingredients: [],
        };

        // Tambahkan kategori baru ke akhir, hapus duplikat, urutkan sesuai urutan masuk
        let categories = storedPreferences.categories.filter(
            cat => !food.categories.map(c => c.name_id).includes(cat)
        );
        categories = [...categories, ...food.categories.map(cat => cat.name_id)];

        // Pastikan setidaknya satu dari REQUIRED_CATEGORIES ada
        const hasRequired = categories.some(cat => REQUIRED_CATEGORIES.includes(cat));
        if (!hasRequired) {
            const fallback = REQUIRED_CATEGORIES.find(cat => !categories.includes(cat));
            if (fallback) {
                categories.push(fallback);
            }
        }

        // Potong hingga maksimal 5 item, yang paling awal akan hilang
        const newCategories = categories.slice(-5);

        // Ingredients: sama, tambahkan ke akhir, hapus duplikat, urutkan sesuai urutan masuk
        let ingredients = storedPreferences.ingredients.filter(
            ing => !food.ingredients.map(i => i.name_id).includes(ing)
        );
        ingredients = [...ingredients, ...food.ingredients.map(ing => ing.name_id)];
        const newIngredients = ingredients.slice(-6);

        const preferences = {
            categories: newCategories,
            ingredients: newIngredients,
        };

        localStorage.setItem("preferences", JSON.stringify(preferences));

        if (auth && auth.user) {
            axios.post(
                "/api/update-preference",
                { preferences },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log("Preferences synced to server.");
                        showToast("Preferences updated", "success");
                    },
                    onError: () => {
                        console.error("Failed to update preferences.");
                        showToast("Failed to update preferences", "error");
                    },
                }
            );
        }
    };

    return (
        <>
            <button
                aria-label="Add to favorites"
                className={`flex-1 ml-4 ${isFavorited ? "bg-[#E63946] text-white" : "bg-white text-gray-800 border-2 hover:bg-slate-100"} font-semibold rounded-xl py-3 md:text-lg text-md flex items-center justify-center space-x-3 transition`}
                onClick={handleFavorite}
                disabled={pending}
            >
                {isFavorited ? (
                    <HeartSolid className="w-6 h-6" />
                ) : (
                    <HeartOutline className="w-6 h-6" />
                )}
                <span>
                    {isFavorited ? t("global.addedToFavorites") : t("global.addToFavorite")}
                </span>
            </button>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModalState(false)}
                defaultMode={authMode}
            />
        </>
    );
}