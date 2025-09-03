import { useTranslation } from "react-i18next";
import { getImageUrl } from "@/Utils/imageHelper";

export default function ProductIngredients({ ingredients }) {
    const { t, i18n } = useTranslation();

    return (
        <div className="tab-content">
            <h2 className="text-gray-900 font-semibold text-lg mb-4">
                {t("home.ingredients")}
            </h2>
            <div
                id="mini-carousel"
                className="flex gap-4 py-2 overflow-x-auto scrollbar-hide cursor-grab select-none"
            >
                {ingredients && ingredients.length > 0 ? (
                    ingredients.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-32 flex flex-col items-center bg-white rounded-xl shadow p-2"
                        >
                            <img
                                src={getImageUrl(item.image)}
                                alt={i18n.language === "en" ? item.name_en : item.name_id}
                                className="w-14 h-14 object-contain mb-2"
                            />
                            <p className="text-xs font-medium text-gray-700 text-center">
                                {i18n.language === "en" ? item.name_en : item.name_id}
                            </p>
                        </div>
                    ))
                ) : (
                    <>
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-32 flex flex-col items-center bg-gray-100 rounded-xl p-2 animate-pulse"
                            >
                                <div className="w-14 h-14 rounded-lg bg-gray-300 mb-2"></div>
                                <div className="h-3 w-16 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
