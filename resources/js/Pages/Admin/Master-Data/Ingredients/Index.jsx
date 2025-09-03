import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import TitleCard from "@/Components/Atoms/TitleCard";
import StatCard from "@/Components/Atoms/StatCard";
import IngredientTable from "@/Pages/Admin/Master-Data/Ingredients/partials/IngredientTable";
import { useTranslation } from "react-i18next";

import { BeakerIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const IngredientsPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("ingredient.pageTitle")}
                    subtitle={t("ingredient.pageSubtitle")}
                />


                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>{t("ingredient.pageTitle")}</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header={t("ingredient.welcome")}
                        description={t("ingredient.description")}
                    />

                    <StatCard
                        label={`Total ${t("ingredient.pageTitle")}`}
                        value={usePage().props.totalIngredients || "0"}
                        icon={BeakerIcon}
                    />
                </div>

                <IngredientTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default IngredientsPage;