import React, { useState, useEffect } from "react";
import { Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";

import Button from "@/Components/Atoms/Button";
import Rating from "@/Components/Atoms/Rating";
import LimitedText from "@/Components/Atoms/LimitedText";

import Logo from "../../../../public/assets/Logo/Logo.jpg"
import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/Utils/imageHelper";

const MAX_RECOMMEND = 10;

const SkeletonCard = () => (
  <div className="border-2 border-gray-200 p-4 rounded-lg h-40 animate-pulse bg-gray-100">
    <div className="w-16 h-16 rounded-full bg-gray-300 mb-2" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-1" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);


const ManageDishes = ({ recommendations }) => {
  const { t, i18n } = useTranslation();

  const [view, setView] = useState("grid");
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleSelect = (id) => {
    if (selectedDishes.includes(id)) {
      const filtered = selectedDishes.filter((dishId) => dishId !== id);
      setSelectedDishes(filtered);
    } else {
      if (selectedDishes.length >= MAX_RECOMMEND) {
        Swal.fire("Info", `Maksimal ${MAX_RECOMMEND} rekomendasi saja!`, "info");
        return;
      }
      const added = [...selectedDishes, id];
      setSelectedDishes(added);
    }
  };

  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      const ids = recommendations.map(rec => rec.food_id ?? rec.id);
      setSelectedDishes(ids);
    }
  }, [recommendations]);

  const fetchProducts = (page = 1, searchValue = "") => {
    setIsLoading(true);
    axios
      .get("/admin/product/data", { params: { page, search: searchValue, filter: { is_active: true } } })
      .then((response) => {
        console.log("Page:", page, "Fetched:", response.data.data.length, "Total dishes before:", dishes.length);
        setDishes((prev) =>
          page === 1 ? response.data.data : [...prev, ...response.data.data]
        );
        setTotalPages(response.data.last_page);
        setCurrentPage(page);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };


  useEffect(() => {
    fetchProducts(1, search);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchMoreData = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1, search);
    }
  };

  const handleSave = () => {
    axios
      .post("/admin/recommendation/save", { food_ids: selectedDishes })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: t("global.swalSuccess"),
          text: t("product.recommendationCreated"),
        });
      })
      .catch(() => {
        Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan rekomendasi.", "error");
      });
  };


  return (
    <div className="flex-1">
      <div className="mb-4 sticky top-20 z-10 bg-white">
        <div className="flex md:flex-row flex-col items-center justify-between pb-4">
          <h2 className="text-xl font-semibold">{t("global.createManualRecommendation")}</h2>
          <div className="flex md:flex-row flex-col md:items-center items-start gap-2">
            <Button
              className="border-2 text-white bg-[#D9B36A] border-[#D9B36A] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#b89a54] hover:border-[#b89a54] transition duration-200 ease-in-out"
              onClick={handleSave}
              disabled={selectedDishes.length === 0}
            >
              {t("global.save")} {t("global.recommendation")} ({selectedDishes.length})
            </Button>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-md ${view === "grid" ? "bg-[#D9B36A] text-white" : "bg-gray-100"}`}
                onClick={() => setView("grid")}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-md ${view === "list" ? "bg-[#D9B36A] text-white" : "bg-gray-100"}`}
                onClick={() => setView("list")}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            placeholder={t('navbar.searchPlaceholder')}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <InfiniteScroll
        dataLength={dishes.length}
        next={fetchMoreData}
        hasMore={currentPage < totalPages}
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
        className="overflow-y-auto rounded-2xl"
      >
        <div className={view === "grid" ? "grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-4" : "space-y-4"}>
          {dishes.map((dish) => {
            const isSelected = selectedDishes.includes(dish.id);
            const description = i18n.language === "en"
              ? dish.description_en
              : dish.description_id;
            return (
              <div
                key={dish.id}
                className={`cursor-pointer border-2 p-4 flex rounded-lg shadow-sm hover:shadow-md transition ${view === "list" ? "flex-row gap-4" : "flex-col gap-4"
                  } ${isSelected ? "border-[#D9B36A] ring-2 ring-[none]" : "border-gray-200"}`}
                onClick={() => handleSelect(dish.id)}
              >
                <img
                  src={dish.image ? getImageUrl(dish.image) : Logo}
                  alt={dish.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = Logo;
                  }}
                />

                <div>
                  <div className="text-sm text-gray-500">{dish.category}</div>
                  <div className="font-medium">{dish.name}</div>
                  <div className="text-black font-semibold">Rp. {dish.price}</div>
                  <Rating rating={dish.average_rating} userReviewCount={dish.rating_count} />

                  <LimitedText text={description} limit={5} />
                </div>
              </div>
            );
          })}
          {isLoading &&
            Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
        </div>
      </InfiniteScroll>
    </div >
  );
};

export default ManageDishes;
