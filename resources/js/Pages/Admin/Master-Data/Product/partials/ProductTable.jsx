import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Table from "@/Layouts/Table";

import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import CreateUserModal from "./CreateModal";
import EditModal from "./EditModal";

import LimitedText from "@/Components/Atoms/LimitedText";
import Card from "@/Components/Atoms/Card";
import LightboxImage from "@/Components/Atoms/LightboxImage";
import Favorite from "@/Components/Atoms/Favorite";
import Rating from "@/Components/Atoms/Rating";
import StatusBadge from "@/Components/Molecules/StatusBadge";

import TableActionButtons from "@/Components/Molecules/TableActionButtons";

// Utlis
import { getErrorMessage } from "@/Utils/getErrorMessage";

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
            .get(`/admin/product/${product.id}/edit`)
            .then((response) => {
                setSelectedProduct(response.data.data);
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

                Swal.fire({
                    icon: "success",
                    title: t("global.swalDeleted", "Deleted!"),
                    text: t("product.pageTitle") + " " + t("global.deletedMessage"),
                });
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error, t, i18n.language);

                Swal.fire(
                    t("global.swalError", "Error!"),
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
            .post(route('admin.product.bulk-delete'), { ids: selectedIds })
            .then(() => {
                setIsProcessing(false);
                setIsDeleteSelectedModalOpen(false);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalDeleted", "Deleted!"),
                    text: t("product.pageTitle") + " " + t("global.deletedMessage"),
                });
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
            header: t("global.name"),
            accessor: ('name')
        },
        {
            header: t("global.image"),
            accessor: (row) =>
                (row.image || row.image_2 || row.image_3) ? (
                    <div className="flex flex-col gap-2">
                        {[row.image, row.image_2, row.image_3].map((img, idx) =>
                            <LightboxImage
                                key={idx}
                                src={`/${img}`}
                                alt={row.name}
                                className="h-12 w-12 object-cover rounded"
                            />
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400 italic">-</span>
                ),
        },
        {
            header: t("global.description"),
            accessor: (row) => {
                const description = i18n.language === "en" ? row.description_en : row.description_id;
                return <LimitedText text={description} limit={5} />
            },
        },
        {
            header: t("global.price"),
            accessor: (row) => `Rp. ${row.price}`,
        },
        {
            header: "Rating",
            accessor: (row) =>
                <Rating rating={row.rating} userReviewCount={row.rating_count} detailView={true} />
        },
        {
            header: t("global.favorite"),
            accessor: (row) =>
                <Favorite count={row.favorites_count} />,
            className: "text-center"
        },
        { header: "stand_id", accessor: "stand_id", className: "text-center" },
        {
            header: t("category.pageTitle"),
            accessor: row => {
                if (row.categories && row.categories.length > 0) {
                    const names = row.categories.map(cat =>
                        i18n.language === "en" ? cat.name_en : cat.name_id
                    );
                    const joined = names.join(", ");
                    return <LimitedText text={joined} limit={5} />;
                }
                return "-";
            },
            className: "text-center"
        },
        {
            header: t("ingredient.pageTitle"),
            accessor: row => {
                if (row.ingredients && row.ingredients.length > 0) {
                    const names = row.ingredients.map(ing =>
                        i18n.language === "en" ? ing.name_en : ing.name_id
                    );
                    const joined = names.join(", ");
                    return <LimitedText text={joined} limit={5} />;
                }
                return "-";
            }
        },
        {
            header: "Status", accessor: (row) => (
                <StatusBadge value={row.is_active} />
            ),
            className: "text-center"
        },
        {
            header: t("global.actions"),
            accessor: (row) => (
                <TableActionButtons
                    onEdit={() => openEditModal(row)}
                    onDelete={() => openDeleteModal(row.id)}
                    isPermanentDelete={!row.is_active}
                />
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
                addButtonText={t("product.pageTitle", "Create Product")}
                AddModalContent={CreateUserModal}
                selectable={true}
                onDeleteSelected={handleDeleteSelected}
                isProcessing={isLoading}
            />

            <CreateUserModal isOpen={isModalOpen} onClose={toggleModal} setRefetch={setRefetch} />

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
                deleteButtonText={t("product.deleteButton", "Delete Product")}
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