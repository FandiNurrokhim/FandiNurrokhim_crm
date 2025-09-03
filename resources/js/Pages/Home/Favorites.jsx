import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { HeartIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import AuthModal from '@/Components/Organisms/AuthModal';

import HomeLayout from '@/Layouts/HomeLayout';
import CardProduct from '@/Components/Atoms/CardProduct';

import { useTranslation } from 'react-i18next';

export default function Favorites({ favorites }) {
  const { auth } = usePage().props;
  const { t } = useTranslation();

  const [favoriteList, setFavoriteList] = useState(favorites);

  // Handler untuk menghapus favorit
  const handleRemoveFavorite = (favoriteId) => {
    setFavoriteList(prev => prev.filter(fav => fav.id !== favoriteId));
  };
  return (
    <HomeLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("favorites.myFavorites")}</h1>

        {!auth?.user ? (
          <NotLoggedIn t={t} />
        ) : favoriteList.length === 0 ? (
          <NoFavourites t={t} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoriteList.map(fav => (
              <CardProduct
                key={fav.id}
                product={fav.food}
                showFavorite
                isFavorited={true}
                onRemove={() => handleRemoveFavorite(fav.id)}
              />
            ))}
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

const NotLoggedIn = ({ t }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-blue-100">
          <ArrowLeftOnRectangleIcon className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("favorites.notLogin")}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {t("favorites.notLoginDescription")}
        </p>
        <button
          onClick={() => {
            setAuthMode("login");
            setShowAuthModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          {t("global.login")}
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
};

const NoFavourites = ({ t }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-pink-100">
        <HeartIcon className="w-12 h-12 text-pink-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("favorites.noFavoritesFound")}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {t("favorites.noFavoritesFoundDescription")}
      </p>
      <Link
        href="/home"
        className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
      >
        {t("global.goBack")}
      </Link>
    </div>
  );
};
