import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import TitleCard from "@/Components/Atoms/TitleCard";
import StandTable from "@/Pages/Admin/Master-Data/Stands/partials/StandTable";
import { useTranslation } from "react-i18next";

const IngredientsPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("stand.pageTitle")}
                    subtitle={t("stand.pageSubtitle")}
                />

                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>{t("stand.pageTitle")}</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header={t("stand.welcome")}
                        description={t("stand.description")}
                    />
                </div>

                <StandTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default IngredientsPage;