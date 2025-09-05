import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import DealTable from "@/Pages/Admin/Deal/partials/DealTable";
import TitleCard from "@/Components/Atoms/TitleCard";
import StatCard from "@/Components/Atoms/StatCard";
import { UserGroupIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import { useTranslation } from "react-i18next";

const DealPage = () => {
    const { t } = useTranslation();
    const { dealCount, waitingApprovalCount, approvedCount, rejectedCount } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title="Deal"
                    subtitle="Manage your leads efficiently from this centralized dashboard."
                />

                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>Deal</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header="Selamat Datang di Halaman Deal"
                        description="Kelola data deal dengan mudah dan cepat."
                    />

                    <StatCard
                        label="Total Deal"
                        value={dealCount || "0"}
                        icon={UserGroupIcon}
                    />
                    <StatCard
                        label="Menunggu Persetujuan"
                        value={waitingApprovalCount || "0"}
                        icon={ClockIcon}
                    />
                    <StatCard
                        label="Disetujui"
                        value={approvedCount || "0"}
                        icon={CheckCircleIcon}
                    />
                    <StatCard
                        label="Ditolak"
                        value={rejectedCount || "0"}
                        icon={XCircleIcon}
                    />
                </div>
                <DealTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default DealPage;