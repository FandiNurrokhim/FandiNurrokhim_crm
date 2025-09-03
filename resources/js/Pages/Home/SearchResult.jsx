import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import HomeLayout from "@/Layouts/HomeLayout";
import ProductFilter from "@/Components/Organisms/ProductFilter";
import CardProduct from "@/Components/Atoms/CardProduct";
import CardProductSkeleton from "@/Components/Atoms/CardProductSkeleton";
import { Drawer, Button, IconButton } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function SearchResult({ categories = [], search = "", selectedCategory = null }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetchedCount, setLastFetchedCount] = useState(0);

    const { t } = useTranslation();

    const [filters, setFilters] = useState({
        search: search,
        sort: "featured",
        selectedItems: [],
        selectedCategory: selectedCategory,
        price: [0, 25000],
        rating: null,
    });

    // Drawer state
    const [showFilter, setShowFilter] = useState(false);

    const handleApplyFilter = async (newFilters = filters, isLoadMore = false) => {
        if (isLoading) return;
        setIsLoading(true);

        const nextPage = isLoadMore ? page + 1 : 1;

        try {
            const res = await axios.get("/api/filter-product", {
                params: {
                    search: newFilters.search,
                    sort: newFilters.sort,
                    rating: newFilters.rating,
                    price_min: newFilters.price[0],
                    price_max: newFilters.price[1],
                    categories: newFilters.selectedItems,
                    page: nextPage,
                },
            });

            const newProducts = res.data.products;
            setLastFetchedCount(newProducts.data.length);

            if (isLoadMore) {
                setProducts((prev) => [...prev, ...newProducts.data]);
            } else {
                setProducts(newProducts.data);
            }

            setFilters(newFilters);
            setPage(newProducts.current_page);
            setHasMore(newProducts.current_page < newProducts.last_page);
        } catch (err) {
            console.error("Error fetching products", err);
        }

        setIsLoading(false);
    };

    return (
        <HomeLayout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Filter Button for mobile */}
                <div className="lg:hidden mb-2 sticky top-[7.3rem] z-[40] flex justify-end">
                    <Button
                        className="px-4 py-2 rounded-lg font-semibold normal-case bg-[#D9B36A]"
                        onClick={() => setShowFilter(true)}
                    >
                        Filter
                    </Button>
                </div>

                <div className="flex gap-4">
                    {/* Drawer for Filter */}
                    <Drawer
                        open={showFilter}
                        onClose={() => setShowFilter(false)}
                        placement="right"
                        size={320}
                        className="p-0 h-screen max-h-screen flex flex-col z-[9999]"
                        overlayProps={{ className: "z-[9998] bg-black/25" }}
                    >
                        <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 border-b">
                            <h2 className="text-lg font-bold">Filter</h2>
                            <IconButton
                                variant="text"
                                color="blue-gray"
                                onClick={() => setShowFilter(false)}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </IconButton>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            <ProductFilter
                                categories={categories}
                                filters={filters}
                                selectedCategory={selectedCategory}
                                setFilters={setFilters}
                                onApply={(f) => {
                                    handleApplyFilter(f);
                                    setShowFilter(false);
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    </Drawer>

                    {/* Sidebar Filter for desktop */}
                    <div className="sticky md:w-96 md:top-32 lg:top-24 h-fit hidden lg:block">
                        <ProductFilter
                            categories={categories}
                            filters={filters}
                            selectedCategory={selectedCategory}
                            setFilters={setFilters}
                            onApply={handleApplyFilter}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="flex-1">
                        <InfiniteScroll
                            dataLength={products.length}
                            next={handleApplyFilter}
                            hasMore={hasMore}
                            scrollThreshold={0.75}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 py-5 w-full"
                        >
                            {products.map(product => (
                                <CardProduct key={product.id} product={product} />
                            ))}

                            {/* Skeleton ketika loading dan sudah ada data */}
                            {isLoading && products.length > 0 &&
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <CardProductSkeleton key={`skeleton-next-${idx}`} />
                                ))
                            }

                            {/* Skeleton ketika loading awal dan belum ada data */}
                            {isLoading && products.length === 0 &&
                                Array.from({ length: 10 }).map((_, idx) => (
                                    <CardProductSkeleton key={idx} />
                                ))
                            }
                        </InfiniteScroll>
                    </div>

                    {/* Tampilkan teks jika tidak ada produk dan tidak sedang loading */}
                    {!isLoading && products.length === 0 && (
                        <div className="w-full text-center text-gray-500 py-10">
                            {t("product.notFound")}
                        </div>
                    )}
                </div>
            </div >
        </HomeLayout >
    );
}