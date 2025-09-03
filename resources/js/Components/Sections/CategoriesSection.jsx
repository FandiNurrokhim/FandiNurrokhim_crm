import Logo from '../../../../public/assets/Logo/Logo.jpg';
import { Link } from '@inertiajs/react';
import { getImageUrl } from '@/Utils/imageHelper';

import { useTranslation } from "react-i18next";

export default function CategoriesSection({ categories = [], isLoading = false }) {

    const { t, i18n } = useTranslation();

    const maxCols = 8;
    const categoryCount = categories.length;
    const emptySlots = Math.max(0, maxCols - categoryCount);

    return (
        <section>
            <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 text-xs font-semibold text-center text-gray-700 ${isLoading ? "animate-pulse" : ""}`}>
                {isLoading ? (
                    Array.from({ length: maxCols }).map((_, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-2 shadow flex flex-col items-center space-y-1">
                            <div className="w-10 h-10 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-12 bg-gray-200 rounded" />
                        </div>
                    ))
                ) : (
                    <>
                        {emptySlots > 0 && (
                            <div
                                className={`p-2 bg-gradient-to-tr from-emerald-500 to-green-500 rounded-t-2xl border-b-8 border-[#D9B36A] shadow flex flex-col items-center space-y-1 col-span-3`}
                            >
                                <h2 className="text-white text-2xl font-bold">{t('home.categories')}</h2>
                                <p className="text-md text-white">{t('home.exploreCategories')}</p>
                            </div>
                        )}
                        {categories.map((category) => {
                            const name = i18n.language === "en"
                                ? category.name_en
                                : category.name_id;
                            return (
                                <Link
                                    href={route('home.search', { category: category.name_id })}
                                    key={category.id}
                                    className="bg-white rounded-lg p-2 shadow flex flex-col items-center space-y-1 cursor-pointer hover:shadow-md transition"
                                >
                                    <img
                                        src={category.image ? getImageUrl(category.image) : Logo}
                                        alt={name}
                                        className="w-10 h-10 object-contain mb-2"
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = Logo;
                                        }}
                                    />
                                    <span className='text-gray-600'>{name}</span>
                                </Link>
                            );
                        })}
                    </>
                )}
            </div>
        </section>
    );
}