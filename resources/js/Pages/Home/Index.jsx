import React, { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";

import { useTranslation } from "react-i18next";

export default function HomePage() {
    const { t } = useTranslation();

    const auth = usePage().props.auth;

    return (
        <HomeLayout>
            <div className="min-h-screen flex items-center justify-center text-center text-2xl font-bold">
                Selamat Datang di Aplikasi CRM
            </div>
        </HomeLayout>
    );
}
