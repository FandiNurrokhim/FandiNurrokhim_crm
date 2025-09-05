import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Table from "@/Layouts/Table";
import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import DangerButton from '@/Components/DangerButton';
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import Card from "@/Components/Atoms/Card";
import getErrorMessage from "@/Utils/getErrorMessage";
import { useTranslation } from "react-i18next";

const DealTable = () => {
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDealId, setSelectedDealId] = useState(null);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const openEditModal = (deal) => {
        axios
            .get(`/admin/deal/${deal.id}`)
            .then((response) => {
                setSelectedDeal(response.data.deal);
                setIsEditModalOpen(true);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = error.response?.data?.message || "An error occurred.";
                Swal.fire("Error!", errorMessage, "error");
            });
    };

    const closeEditModal = () => {
        setSelectedDeal(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (dealId) => {
        setSelectedDealId(dealId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedDealId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setIsProcessing(true);
        axios
            .delete(`/admin/deal/${selectedDealId}`)
            .then(() => {
                setIsProcessing(false);
                setIsDeleteModalOpen(false);
                Swal.fire(
                    "Deleted!",
                    "Deal berhasil dihapus.",
                    "success"
                );
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error, t, i18n.language);

                Swal.fire(
                    "Error!",
                    errorMessage,
                    "error"
                );
            });
    };

    const handleDeleteSelected = (ids) => {
        setSelectedIds(ids);
        setIsDeleteSelectedModalOpen(true);
    };

    const confirmDeleteSelected = () => {
        setIsProcessing(true);
        axios
            .post(route('admin.deal.bulk-delete'), { ids: selectedIds })
            .then(() => {
                setIsProcessing(false);
                setIsDeleteSelectedModalOpen(false);
                Swal.fire("Deleted!", "Selected deals have been deleted.", "success");
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error, t, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            });
    };

    const handleSearch = (query) => {
        setSearch(query);
        if (query !== search) {
            setCurrentPage(1);
        }
    };

    const fetchData = () => {
        setIsLoading(true);
        axios
            .get("/admin/deal/data", {
                params: {
                    page: currentPage,
                    search: search,
                },
            })
            .then((response) => {
                setData(response.data.data);
                setTotalPages(response.data.last_page);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, search, refetch]);

    const columns = [
        {
            header: "Judul",
            accessor: (row) => row.title || "-",
        },
        {
            header: "Lead",
            accessor: (row) => row.lead?.name || "-",
        },
        {
            header: "Customer",
            accessor: (row) => row.customer?.name || "-",
        },
        {
            header: "Produk",
            accessor: (row) =>
                row.products && row.products.length > 0
                    ? row.products.map((p, idx) =>
                        <div key={idx}>
                            {p.product_name || "-"} ({p.qty} x Rp{parseInt(p.negotiated_price).toLocaleString()})
                        </div>
                    )
                    : "-",
        },
        {
            header: "Total",
            accessor: (row) => row.total_amount ? `Rp${parseInt(row.total_amount).toLocaleString()}` : "-",
        },
        {
            header: "Status",
            accessor: (row) => {
                let color = "bg-gray-200 text-gray-800";
                if (row.status === "approved") color = "bg-green-200 text-green-800";
                if (row.status === "rejected") color = "bg-red-200 text-red-800";
                if (row.status === "waiting_approval") color = "bg-yellow-200 text-yellow-800";
                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
                        {row.status === "waiting_approval" ? "Menunggu Approval" :
                            row.status === "approved" ? "Disetujui" :
                                row.status === "rejected" ? "Ditolak" : row.status}
                    </span>
                );
            }
        },
        {
            header: "Aksi",
            accessor: (row) => (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => openEditModal(row)}
                        className="inline-flex items-center rounded-md border border-transparent bg-yellow-400 px-2 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 active:bg-yellow-700"
                    >
                        <PencilIcon className="w-5 h-5 me-2 rounded-full bg-yellow-500 p-1 text-white" /> <span>Edit</span>
                    </button>
                    <DangerButton onClick={() => openDeleteModal(row.id)}>
                        <TrashIcon className="w-5 h-5 me-2 rounded-full bg-red-400 p-1 text-white" /> <span>Hapus</span>
                    </DangerButton>
                </div>
            ),
        },
    ];

    return (
        <Card>
            <Table
                columns={columns}
                data={data}
                currentPage={currentPage}
                totalPages={totalPages}
                onSearch={handleSearch}
                onPageChange={(page) => setCurrentPage(page)}
                onAdd={() => setIsModalOpen(true)}
                addType="modal"
                addButtonText="Tambah Deal"
                AddModalContent={CreateModal}
                selectable={true}
                onDeleteSelected={handleDeleteSelected}
                isProcessing={isLoading}
            />

            <CreateModal isOpen={isModalOpen} onClose={toggleModal} setRefetch={setRefetch} />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                deal={selectedDeal}
                setRefetch={setRefetch}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                title="Hapus Deal"
                description="Apakah Anda yakin ingin menghapus deal ini? Tindakan ini tidak dapat dibatalkan."
                deleteButtonText="Hapus Deal"
                isProcessing={isProcessing}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteSelectedModalOpen}
                onClose={() => setIsDeleteSelectedModalOpen(false)}
                onDelete={confirmDeleteSelected}
                title="Hapus Deal Terpilih"
                description="Apakah Anda yakin ingin menghapus deal terpilih? Tindakan ini tidak dapat dibatalkan."
                deleteButtonText="Hapus Terpilih"
                isProcessing={isProcessing}
            />
        </Card>
    );
};

export default DealTable;