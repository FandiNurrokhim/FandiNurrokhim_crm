import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Table from "@/Layouts/Table";
import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import Card from "@/Components/Atoms/Card";
import Dropdown from "@/Components/Dropdown";
import getErrorMessage from "@/Utils/getErrorMessage";
import { useTranslation } from "react-i18next";

const DealManagerTable = () => {
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

    const handleApprove = (dealId) => {
        setIsProcessing(true);
        axios
            .post(`/admin/deal/${dealId}/approve`)
            .then(() => {
                setIsProcessing(false);
                Swal.fire("Success!", "Deal berhasil di-approve.", "success");
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error, t, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            });
    };

    const handleReject = (dealId) => {
        setIsProcessing(true);
        axios
            .post(`/admin/deal/${dealId}/reject`)
            .then(() => {
                setIsProcessing(false);
                Swal.fire("Success!", "Deal berhasil di-reject.", "success");
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
                row.products && row.products.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {row.products.map((p, idx) => (
                            <li key={idx}>
                                {p.name || p.product_name || "-"} (
                                {(p.pivot?.qty ?? p.qty) || 0} x Rp.
                                {(p.pivot?.negotiated_price ?? p.negotiated_price ?? 0).toLocaleString("id-ID")}
                                )
                            </li>
                        ))}
                    </ul>
                ) : "-",
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
                <div className="flex justify-center">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="cursor-pointer bg-gray-100 border px-3 py-1 rounded text-sm font-medium"
                            >
                                Aksi
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content width="48">
                            <div className="flex flex-col w-full p-1">
                                <button
                                    type="button"
                                    onClick={() => openEditModal(row)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => openDeleteModal(row.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                                >
                                    Hapus
                                </button>
                                {row.status === "waiting_approval" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(row.id)}
                                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 rounded"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReject(row.id)}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </Dropdown.Content>
                    </Dropdown>
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

export default DealManagerTable;