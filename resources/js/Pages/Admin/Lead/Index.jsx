import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import LeadTable from "@/Pages/Admin/Lead/partials/LeadTable";
import TitleCard from "@/Components/Atoms/TitleCard";
import StatCard from "@/Components/Atoms/StatCard";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { useTranslation } from "react-i18next";
const UserPage = () => {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title="Lead"
                    subtitle="Manage your leads efficiently from this centralized dashboard."
                />

                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>Lead</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header="Selamat Datang di Halaman Lead"
                        description="Kelola data lead dengan mudah dan cepat."
                    />

                    <StatCard
                        label={`Total Lead`}
                        value={usePage().props.leadCount}
                        icon={UserGroupIcon}
                    />
                </div>
                <LeadTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default UserPage;