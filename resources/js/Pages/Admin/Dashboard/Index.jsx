import React, { use } from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import { useTranslation } from "react-i18next";
import StatCard from "@/Components/Atoms/StatCard";

import { ShoppingBagIcon, UserGroupIcon, TagIcon, BeakerIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import TitleCard from "@/Components/Atoms/TitleCard";

const DashboardPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("ingredient.pageTitle")}
                    subtitle={t("ingredient.pageSubtitle")}
                />
                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <span>Dashboard</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header={t("dashboard.welcome")}
                        description={t("dashboard.description")}
                    />
                </div>
            </div>
        </AuthenticatedLayout >
    );
};

export default DashboardPage;