import React, { use } from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import PartnerTable from "@/Pages/Admin/Dashboard/partials/PartnerTable";
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

                    <StatCard
                        label={`Total ${t("product.pageTitle")}`}
                        value={usePage().props.foodCount || "0"}
                        icon={ShoppingBagIcon}
                    />

                    <StatCard
                        label={`Total ${t("global.user")}`}
                        value={usePage().props.userCount || "0"}
                        icon={UserGroupIcon}
                    />

                    <StatCard
                        label={`Total ${t("category.pageTitle")}`}
                        value={usePage().props.categoryCount || "0"}
                        icon={TagIcon}
                    />

                    <StatCard
                        label={`Total ${t("ingredient.pageTitle")}`}
                        value={usePage().props.ingredientCount || "0"}
                        icon={BeakerIcon}
                    />

                    <StatCard
                        label="Total Stand"
                        value={usePage().props.standCount || "0"}
                        icon={BuildingStorefrontIcon}
                    />

                </div>
                <PartnerTable />
            </div>
        </AuthenticatedLayout >
    );
};

export default DashboardPage;