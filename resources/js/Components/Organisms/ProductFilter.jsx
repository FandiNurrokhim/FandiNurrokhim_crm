import React, { useEffect, useRef } from "react";
import SelectBox from "@/Components/Atoms/SelectBox";
import CheckboxList from "@/Components/Atoms/CheckboxList";
import PriceRangeSlider from "@/Components/Atoms/PriceRangeSlider";
import RatingSelector from "@/Components/Atoms/RatingSelector";
import { useTranslation } from "react-i18next";

export default function ProductFilter({ categories, selectedCategory, filters, setFilters, onApply, isLoading }) {
  const debounceRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onApply && onApply(filters, false);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [filters]);

  useEffect(() => {
    if (selectedCategory && !filters.selectedItems.includes(selectedCategory)) {
      setFilters(prev => ({
        ...prev,
        selectedItems: [selectedCategory],
      }));
    }
  }, [selectedCategory]);


  const handleSearchInput = (e) => {
    if (isLoading) return;
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const toggleItem = (item) => {
    if (isLoading) return;
    setFilters(prev => {
      const selectedItems = prev.selectedItems.includes(item)
        ? prev.selectedItems.filter(i => i !== item)
        : [...prev.selectedItems, item];
      return { ...prev, selectedItems };
    });
  };

  const handleReset = () => {
    if (isLoading) return;
    setFilters({
      search: "",
      sort: "featured",
      selectedItems: [],
      price: [0, 25000],
      rating: null,
    });
  };

  return (
    <div className="bg-white p-4 w-full rounded-lg lg:shadow-md md:shadow-none">
      <input
        type="text"
        placeholder={t('navbar.searchPlaceholder')}
        value={filters.search}
        onChange={handleSearchInput}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded text-sm"
        disabled={isLoading}
      />

      <SelectBox
        label={t("global.sortBy")}
        value={filters.sort}
        onChange={e => !isLoading && setFilters(prev => ({ ...prev, sort: e.target.value }))}
        options={[
          { label: t('global.lowToHigh'), value: "low" },
          { label: t('global.highToLow'), value: "high" },
        ]}
      />

      <CheckboxList
        title={t("global.showing")}
        options={["All Category", ...categories.map(p => p.name_id)]}
        selected={filters.selectedItems}
        onChange={toggleItem}
        disabled={isLoading}
      />

      <RatingSelector
        selectedRating={filters.rating}
        onChange={value => !isLoading && setFilters(prev => ({ ...prev, rating: value }))}
        disabled={isLoading}
      />

      <PriceRangeSlider
        min={0}
        max={35000}
        value={filters.price}
        onChange={value => !isLoading && setFilters(prev => ({ ...prev, price: value }))}
        disabled={isLoading}
      />

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 text-sm border border-gray-300 rounded"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </button>
      </div>
    </div>
  );
}