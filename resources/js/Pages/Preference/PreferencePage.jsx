import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import PreferenceCard from "@/Components/Atoms/PreferenceCard";
import TextInput from "@/Components/TextInput";
import LanguageDropdown from "@/Components/Atoms/LanguageDropdown";
import Swal from "sweetalert2";

export default function PreferencePage() {
  const {
    categories: categoriesRaw = [],
    mainCategories: mainCategoriesRaw = [],
    ingredients: ingredientsRaw = [],
    maxPrice = 500000,
  } = usePage().props;

  const { t, i18n } = useTranslation();

  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : Object.values(categoriesRaw);
  const mainCategories = Array.isArray(mainCategoriesRaw) ? mainCategoriesRaw : Object.values(mainCategoriesRaw);
  const ingredients = Array.isArray(ingredientsRaw) ? ingredientsRaw : Object.values(ingredientsRaw);

  // UBAH: Pisahkan state untuk kategori utama dan rasa
  const [selectedMainCategories, setSelectedMainCategories] = useState([]);
  const [selectedFlavorCategories, setSelectedFlavorCategories] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [budget, setBudget] = useState();
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    const prefs = localStorage.getItem("preferences");
    if (prefs) {
      setHasPreferences(true);
      setTimeout(() => {
        router.visit("/home");
      }, 1000);
    }
  }, []);

  const toggleSelection = (item, list, setList, max = 5, type = "kategori") => {
    if (list.includes(item)) {
      setList((prev) => prev.filter((i) => i !== item));
    } else if (list.length >= max) {
      Swal.fire({
        icon: "warning",
        title: "Batas maksimum",
        text: `Maksimal memilih ${max} ${type}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      setList((prev) => [...prev, item]);
    }
  };

  const savePreferences = () => {
    if (!budget) {
      Swal.fire({
        icon: "warning",
        title: t("preference.alerts.emptyBudgetTitle"),
        text: t("preference.alerts.emptyBudgetText"),
      });
      return;
    } else if (budget < 20000 || budget > (maxPrice || 500000)) {
      Swal.fire({
        icon: "warning",
        title: t("preference.alerts.invalidBudgetTitle"),
        text: t("preference.alerts.invalidBudgetText", {
          maxPrice: `Rp ${(maxPrice || 500000).toLocaleString('id-ID')}`
        }),
      });
      return;
    }

    // UBAH: Validasi terpisah untuk kategori utama dan rasa
    if (selectedMainCategories.length < 1) {
      Swal.fire({
        icon: "warning",
        title: t("preference.alerts.noMainCategoryTitle"),
        text: t("preference.alerts.noMainCategoryText"),
      });
      return;
    } else if (selectedMainCategories.length > 2) {
      Swal.fire({
        icon: "info",
        title: t("preference.alerts.maxMainCategoryTitle"),
        text: t("preference.alerts.maxMainCategoryText"),
      })
      return;
    };

    if (selectedFlavorCategories.length < 2) {
      Swal.fire({
        icon: "warning",
        title: t("preference.alerts.notEnoughCategoryTitle"),
        text: t("preference.alerts.notEnoughCategoryText"),
      });
      return;
    }

    if (selectedIngredients.length < 3) {
      Swal.fire({
        icon: "warning",
        title: t("preference.alerts.notEnoughIngredientTitle"),
        text: t("preference.alerts.notEnoughIngredientText"),
      });
      return;
    }

    // UBAH: Gabungkan kategori utama dan rasa menjadi satu array
    const allSelectedCategories = [...selectedMainCategories, ...selectedFlavorCategories];

    const preferences = {
      categories: allSelectedCategories, // Digabung menjadi satu
      ingredients: selectedIngredients,
      budget,
    };

    localStorage.setItem("preferences", JSON.stringify(preferences));
    router.visit("/home");
  };

  if (hasPreferences) {
    return (
      <div className="h-screen flex flex-col items-center justify-center py-12">
        <div className="bg-green-100 rounded-full p-6 flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        </div>
        <div className="text-gray-700 text-lg font-medium mb-2">
          {t("preference.setSuccess")}
        </div>
        <div className="text-gray-500 mb-4">
          {t("preference.redirectingToHome")}
        </div>
        <div className="flex space-x-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex gap-2">
        <h2 className="text-xl font-bold mb-4">{t("preference.choose")}</h2>
        <LanguageDropdown />
      </div>

      {/* Main Category */}
      <div className="mb-4">
        <h3 className="font-semibold">{t("preference.mainCategory")}</h3>
        <div className="flex flex-wrap gap-2">
          {mainCategories.map((cat) => {
            const name = i18n.language === "en" ? cat.name_en : cat.name_id;
            return (
              <PreferenceCard
                key={cat.id}
                label={name}
                imageUrl={cat.image}
                selected={selectedMainCategories.includes(cat.name_id)}
                disabled={selectedMainCategories.length >= 2 && !selectedMainCategories.includes(cat.name_id)}
                info={
                  selectedMainCategories.length >= 2 && !selectedMainCategories.includes(cat.name_id)
                    ? "Maksimal tercapai"
                    : null
                }
                onClick={() =>
                  toggleSelection(cat.name_id, selectedMainCategories, setSelectedMainCategories, 2, "kategori utama")
                }
              />
            );
          })}
        </div>
      </div>

      {/* Flavor Categories */}
      <div className="mb-4">
        <h3 className="font-semibold">{t("home.flavor")}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const name = i18n.language === "en" ? cat.name_en : cat.name_id;
            return (
              <PreferenceCard
                key={cat.id}
                label={name}
                imageUrl={cat.image}
                selected={selectedFlavorCategories.includes(cat.name_id)}
                disabled={selectedFlavorCategories.length >= 4 && !selectedFlavorCategories.includes(cat.name_id)}
                info={
                  selectedFlavorCategories.length >= 4 && !selectedFlavorCategories.includes(cat.name_id)
                    ? "Maksimal tercapai"
                    : null
                }
                onClick={() =>
                  toggleSelection(cat.name_id, selectedFlavorCategories, setSelectedFlavorCategories, 4, "rasa")
                }
              />
            );
          })}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h3 className="font-semibold">{t("preference.ingredients")}</h3>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => {
            const name = i18n.language === "en" ? ing.name_en : ing.name_id;
            return (
              <PreferenceCard
                key={ing.id}
                label={name}
                imageUrl={ing.image}
                selected={selectedIngredients.includes(ing.name_id)}
                disabled={selectedIngredients.length >= 6 && !selectedIngredients.includes(ing.name_id)}
                info={
                  selectedIngredients.length >= 6 && !selectedIngredients.includes(ing.name_id)
                    ? "Maksimal tercapai"
                    : null
                }
                onClick={() =>
                  toggleSelection(ing.name_id, selectedIngredients, setSelectedIngredients, 6, "bahan")
                }
              />
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">{t("preference.yourBudget")}</h3>
        <div className=" items-center gap-4 w-full">
          <TextInput
            type="number"
            min={20000}
            max={maxPrice || 500000}
            step={1000}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Rp. 20000"
            required
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {t("preference.maxPrice", { price: `Rp ${maxPrice || 100000}` })}
        </div>
      </div>

      <button
        className="bg-[#D9B36A] text-[#0E1C2D] hover:bg-[#caa45f] rounded-md w-full px-4 py-1.5 text-lg font-semibold transition"
        onClick={savePreferences}
      >
        {t("preference.save")}
      </button>
    </div>
  );
}