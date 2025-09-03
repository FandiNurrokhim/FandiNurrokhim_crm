import { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

import CardProduct from "@/Components/Atoms/CardProduct";
import CardProductSkeleton from "@/Components/Atoms/CardProductSkeleton";
import EmptyProductPlaceholder from "@/Components/Atoms/EmptyProductPlaceholder";

import { useTranslation } from "react-i18next";

export default function AllProductSection({ categories = [] }) {
    const { t, i18n } = useTranslation();

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Tambahkan kategori "All" di awal
    const categoriesWithAll = [
        { key: "all", label: "All" },
        ...categories.map(cat => ({
            ...cat,
            key: cat.key || cat.id,
            label: cat.label || (i18n.language === "en" ? cat.name_en : cat.name_id),
        })),
    ];

    // Fetch products from API
    const fetchProducts = useCallback(async (category, pageNum, append = false) => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/products", {
                params: {
                    category: category === "all" ? undefined : category,
                    page: pageNum,
                },
            });
            const newProducts = res.data.data || res.data;
            setProducts(prev =>
                append ? [...prev, ...newProducts] : newProducts
            );
            setHasMore(res.data.next_page_url !== null);
        } catch {
            setProducts([]);
            setHasMore(false);
        }
        setIsLoading(false);
    }, []);

    // Initial load & category change
    useEffect(() => {
        setPage(1);
        fetchProducts(selectedCategory, 1, false);
    }, [selectedCategory, fetchProducts]);

    // Infinite scroll fetch more
    const fetchMoreData = () => {
        fetchProducts(selectedCategory, page + 1, true);
        setPage(prev => prev + 1);
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-gray-900 font-semibold text-lg mb-3 sm:mb-0">
                    {t("home.allProducts")}
                </h2>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 font-semibold">
                    {categoriesWithAll.map(cat => (
                        <button
                            key={cat.key}
                            className={`rounded-full px-3 py-1 transition ${selectedCategory === cat.key
                                ? "bg-[#D9B36A] text-[#0E1C2D] hover:bg-[#caa45f]"
                                : "bg-white border border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => {
                                setSelectedCategory(cat.key);
                                setProducts([]);
                                setHasMore(true);
                            }}
                            disabled={isLoading}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-gray-500 text-xs mb-6">
                {t("global.showing")}: {selectedCategory === "all"
                    ? "All"
                    : categoriesWithAll.find(c => c.key === selectedCategory)?.label}
            </p>
            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreData}
                hasMore={hasMore}
                scrollThreshold={0.75}
            >
                {!isLoading && products.length === 0 && (
                    <EmptyProductPlaceholder />
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 py-5 overflow-hidden">
                    {products.map(product => (
                        <CardProduct key={product.id} product={product} isFavorited={product.isFavorite} favoriteDisplayOnly={true} showFavorite={true}/>
                    ))}
                    {isLoading && products.length > 0 &&
                        Array.from({ length: 5 }).map((_, idx) => (
                            <CardProductSkeleton key={`skeleton-next-${idx}`} />
                        ))
                    }
                    {isLoading && products.length === 0 &&
                        Array.from({ length: 10 }).map((_, idx) => (
                            <CardProductSkeleton key={idx} />
                        ))
                    }
                </div>
            </InfiniteScroll>
        </section>
    );
}