import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    ArrowRightStartOnRectangleIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';

import AuthModal from '@/Components/Organisms/AuthModal';
import SearchBar from '@/Components/Molecules/SearchBar';
import LanguageDropdown from '@/Components/Atoms/LanguageDropdown';
import AvatarWithDropdown from '@/Components/Atoms/AvatarWithDropdown';

import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const { t } = useTranslation();

    const { auth } = usePage().props;
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    return (
        <header className="w-full bg-[#0E1C2D] border-b border-[#D9B36A] sticky top-0 z-[10]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-white">
                        CRM
                    </Link>

                    {/* Right section for desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {!auth?.user ? (
                            <>
                                <button
                                    type="button"
                                    className="border border-[#D9B36A] text-[#D9B36A] hover:bg-[#D9B36A] hover:text-[#0E1C2D] rounded-full px-4 py-1.5 text-sm transition"
                                    onClick={() => {
                                        setAuthMode('login');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                        <span>{t('navbar.login')}</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className="bg-[#D9B36A] text-[#0E1C2D] hover:bg-[#caa45f] rounded-full px-4 py-1.5 text-sm font-semibold transition"
                                    onClick={() => {
                                        setAuthMode('register');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    {t('navbar.register')}
                                </button>
                            </>
                        ) : (
                            <AvatarWithDropdown className="block" />
                        )}
                    </div>
                </div>

                {/* Mobile: Language & Login/Register below search, right aligned */}
                <div className="flex flex-col items-end gap-2 mt-2 lg:hidden">
                    <div className="flex items-center gap-2">
                        <LanguageDropdown />
                        {!auth?.user ? (
                            <>
                                <button
                                    type="button"
                                    className="border border-[#D9B36A] text-[#D9B36A] hover:bg-[#D9B36A] hover:text-[#0E1C2D] rounded-full px-4 py-1.5 text-sm transition"
                                    onClick={() => {
                                        setAuthMode('login');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                        <span>{t('navbar.login')}</span>
                                    </div>
                                </button>
                                <AuthModal
                                    isOpen={showAuthModal}
                                    onClose={() => setShowAuthModal(false)}
                                    defaultMode={authMode}
                                />
                            </>
                        ) : (
                            <AvatarWithDropdown className="block" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}   