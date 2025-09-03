import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import { useTranslation } from "react-i18next";
import BannerPage from "@/Components/Organisms/BannerPage";

const SystemSettingPage = () => {
    const banners = usePage().props.banners || [];
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("setting.pageTitle")}
                    subtitle={t("setting.pageSubtitle")}
                />


                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>{t("setting.pageTitle")}</span>
                </Breadcrumbs>

                <BannerPage banners={banners} />
            </div>
        </AuthenticatedLayout>
    );
};

export default SystemSettingPage;