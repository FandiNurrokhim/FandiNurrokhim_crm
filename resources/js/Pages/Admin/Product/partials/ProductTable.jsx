import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Table from "@/Layouts/Table";
import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import DangerButton from '@/Components/DangerButton';
import CreateProductModal from "./CreateModal";
import EditModal from "./EditModal";
import Card from "@/Components/Atoms/Card";

// Utlis
import getErrorMessage from "@/Utils/getErrorMessage"

// Translate
import { useTranslation } from "react-i18next";

const ProductTable = () => {

    // Translation
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const openEditModal = (product) => {
        axios
            .get(`/admin/product/${product.id}`)
            .then((response) => {
                setSelectedProduct(response.data.product);
                setIsEditModalOpen(true);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = error.response?.data?.message || "An error occurred.";
                Swal.fire("Error!", errorMessage, "error");
            });
    };

    const closeEditModal = () => {
        setSelectedProduct(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (productId) => {
        setSelectedProductId(productId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedProductId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setIsProcessing(true);
        axios
            .delete(`/admin/product/${selectedProductId}`)
            .then(() => {
                setIsProcessing(false);
                setIsDeleteModalOpen(false);
                Swal.fire(
                    t("global.swalDeleted", "Deleted!"),
                    t("product.deletedMessage", "Product has been deleted."),
                    "success"
                );
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const statusCode = error.response?.status;
                const errorMessage = getErrorMessage(error, t, i18n.language);

                if (statusCode === 400 || statusCode === 422) {
                    Swal.fire("Info!", errorMessage, "info");
                } else {
                    Swal.fire("Error!", errorMessage, "error");
                }
            });
    };

    const handleDeleteSelected = (ids) => {
        setSelectedIds(ids);
        setIsDeleteSelectedModalOpen(true);
    };

    const confirmDeleteSelected = () => {
        setIsProcessing(true);
        axios
            .post(route('admin.product.bulk-delete'), { ids: selectedIds })
            .then(() => {
                setIsProcessing(false);
                setIsDeleteSelectedModalOpen(false);
                Swal.fire("Deleted!", "Selected products have been deleted.", "success");
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const statusCode = error.response?.status;
                const errorMessage = getErrorMessage(error, t, i18n.language);

                if (statusCode === 400 || statusCode === 422) {
                    Swal.fire("Info!", errorMessage, "info");
                } else {
                    Swal.fire("Error!", errorMessage, "error");
                }
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
            .get("/admin/product/data", {
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
            .catch((error) => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, search, refetch]);

    const columns = [
        {
            header: "Nama",
            accessor: (row) => row.name || "-",
            className: "font-semibold"
        },
        {
            header: "Jumlah Customer",
            accessor: (row) => row.customers_count || "-",
            className: "text-center"
        },
        {
            header: "HPP",
            accessor: (row) => row.hpp ? `Rp${parseInt(row.hpp).toLocaleString()}` : "-",
            className: "text-right"
        },
        {
            header: "Margin (%)",
            accessor: (row) => row.margin_percent ? `${row.margin_percent}%` : "-",
            className: "text-right"
        },
        {
            header: "Harga Jual",
            accessor: (row) => {
                const hpp = parseFloat(row.hpp) || 0;
                const margin = parseFloat(row.margin_percent) || 0;
                const sellPrice = hpp + (hpp * margin / 100);
                return `Rp${sellPrice.toLocaleString()}`;
            },
            className: "text-right"
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
                addButtonText={t("global.product", "Product")}
                AddModalContent={CreateProductModal}
                selectable={true}
                onDeleteSelected={handleDeleteSelected}
                isProcessing={isLoading}
            />

            <CreateProductModal isOpen={isModalOpen} onClose={toggleModal} setRefetch={setRefetch} />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                product={selectedProduct}
                setRefetch={setRefetch}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                title={t("product.deleteTitle", "Delete Product")}
                description={t("product.deleteDescription", "Are you sure you want to delete this product? This action cannot be undone.")}
                deleteButtonText={t("product.deleteTitle", "Delete Product")}
                isProcessing={isProcessing}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteSelectedModalOpen}
                onClose={() => setIsDeleteSelectedModalOpen(false)}
                onDelete={confirmDeleteSelected}
                title={t("product.deleteSelectedTitle", "Delete Selected Products")}
                description={t("product.deleteSelectedDescription", "Are you sure you want to delete the selected products? This action cannot be undone.")}
                deleteButtonText={t("product.deleteSelectedButton", "Delete Selected")}
                isProcessing={isProcessing}
            />
        </Card>
    );
};

export default ProductTable;