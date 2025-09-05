import React from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PageHeader from "@/Components/Atoms/PageHeader";
import CustomerTable from "@/Pages/Admin/Customer/partials/CustomerTable";
import TitleCard from "@/Components/Atoms/TitleCard";
import StatCard from "@/Components/Atoms/StatCard";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { useTranslation } from "react-i18next";
const UserPage = () => {
    const { t } = useTranslation();
    const { totalCustomer } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="space-y-4">
                <PageHeader
                    title="Customer"
                    subtitle="Kelola data customer"
                />

                <Breadcrumbs className="bg-slate-800 p-2 rounded-md text-white mb-4">
                    <Link href="dashboard" className="opacity-60 hover:opacity-100">
                        Dashboard
                    </Link>
                    <span>Customer</span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TitleCard
                        header="Selamat Datang di Customer"
                        description="Laman ini digunakan untuk melihat data customer."
                    />

                    <StatCard
                        label={`Total Customer`}
                        value={totalCustomer}
                        icon={UserGroupIcon}
                    />
                </div>
                <CustomerTable />
            </div>
        </AuthenticatedLayout>
    );
};

export default UserPage;