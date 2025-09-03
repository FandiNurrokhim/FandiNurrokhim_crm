import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import TitleCard from "@/Components/Atoms/TitleCard";
import StatCard from "@/Components/Atoms/StatCard";
import Card from "@/Components/Atoms/Card";
import ProductTable from "@/Pages/Admin/Master-Data/Product/partials/ProductTable";
import MakeRecommendation from "@/Pages/Admin/Master-Data/Product/partials/MakeRecommendation";
import { useTranslation } from "react-i18next";

import {
    ShoppingBagIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";


const IngredientsPage = ({ manualRecommendations }) => {
    const { t } = useTranslation();
    const { foodStats, reviewStats } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title={t("product.pageTitle")}
                    subtitle={t("product.pageSubtitle")}
                />

                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>{t("product.pageTitle")}</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header={t("product.welcome")}
                        description={t("product.description")}
                    />

                    <StatCard
                        label={`Total ${t("product.pageTitle")}`}
                        value={foodStats?.total || "0"}
                        icon={ShoppingBagIcon}
                    />
                    <StatCard
                        label={`Total ${t("global.active")}`}
                        value={foodStats?.active || "0"}
                        icon={CheckCircleIcon}
                    />
                    <StatCard
                        label={`Total ${t("global.inactive")}`}
                        value={foodStats?.inactive || "0"}
                        icon={XCircleIcon}
                    />
                    <StatCard
                        label={`Total ${t("global.review")}`}
                        value={reviewStats?.total || "0"}
                        icon={ChatBubbleLeftRightIcon}
                    />
                </div>


                <ProductTable />

                <Card>
                    <MakeRecommendation manualRecommendations={manualRecommendations} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default IngredientsPage;