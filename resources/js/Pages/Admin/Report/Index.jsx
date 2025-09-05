import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import ReportTable from "@/Pages/Admin/Report/partials/ReportTable";
import TitleCard from "@/Components/Atoms/TitleCard";

import { useTranslation } from "react-i18next";
const UserPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("global.user")}
                    subtitle={t("user.pageSubtitle")}
                />

                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>{t("global.user")}</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header={t("user.welcome")}
                        description={t("user.description")}
                    />
{/* 
                    <StatCard
                        label={`Total ${t("global.user")}`}
                        value={usePage().props.userCount || "0"}
                        icon={UserGroupIcon}
                    /> */}
                </div>
                <ReportTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default UserPage;