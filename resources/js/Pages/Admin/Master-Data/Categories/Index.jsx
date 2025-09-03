import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import TitleCard from "@/Components/Atoms/TitleCard";
import StatCard from "@/Components/Atoms/StatCard";
import CategoryTable from "@/Pages/Admin/Master-Data/Categories/partials/CategoryTable";
import { useTranslation } from "react-i18next";

import { TagIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const IngredientsPage = () => {
    const { t } = useTranslation();
    const categoryStats = usePage().props.categoryStats || {};

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("category.pageTitle")}
                    subtitle={t("category.pageSubtitle")}
                />


                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>{t("category.pageTitle")}</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header={t("category.welcome")}
                        description={t("category.description")}
                    />

                    <StatCard
                        label={`Total ${t("category.pageTitle")}`}
                        value={categoryStats?.total || "0"}
                        icon={TagIcon}
                    />
                    <StatCard
                        label={`Total ${t("global.active")}`}
                        value={categoryStats?.active || "0"}
                        icon={CheckCircleIcon}
                    />
                    <StatCard
                        label={`Total ${t("global.inactive")}`}
                        value={categoryStats?.inactive || "0"}
                        icon={XCircleIcon}
                    />
                </div>

                <CategoryTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default IngredientsPage;