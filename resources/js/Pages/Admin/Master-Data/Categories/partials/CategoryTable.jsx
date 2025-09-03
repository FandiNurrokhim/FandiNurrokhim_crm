import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Table from "@/Layouts/Table";
import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import CreateUserModal from "./CreateModal";
import EditModal from "./EditModal";
import Card from "@/Components/Atoms/Card";
import TableActionButtons from "@/Components/Molecules/TableActionButtons";
import LightboxImage from "@/Components/Atoms/LightboxImage";

// Utlis
import { getErrorMessage } from "@/Utils/getErrorMessage";

// Translate
import { useTranslation } from "react-i18next";
import StatusBadge from "@/Components/Molecules/StatusBadge";

const CategoryTable = () => {

    // Translation
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const openEditModal = (category) => {
        axios
            .get(`/admin/category/${category.id}/edit`)
            .then((response) => {
                setSelectedCategory(response.data.data);
                setIsEditModalOpen(true);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = error.response?.data?.message || "An error occurred.";
                Swal.fire("Error!", errorMessage, "error");
            });
    };

    const closeEditModal = () => {
        setSelectedCategory(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedCategoryId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setIsProcessing(true);
        axios
            .delete(`/admin/category/${selectedCategoryId}`)
            .then(() => {
                setIsProcessing(false);
                setIsDeleteModalOpen(false);
                Swal.fire(
                    t("global.swalDeleted", "Deleted!"),
                    t("category.deletedMessage", "Ingredient has been deleted."),
                    "success"
                );
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
            .post(route('admin.category.bulk-delete'), { ids: selectedIds })
            .then(() => {
                setIsProcessing(false);
                setIsDeleteSelectedModalOpen(false);
                Swal.fire("Deleted!", "Selected category have been deleted.", "success");
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
            .get("/admin/category/data", {
                params: {
                    page: currentPage,
                    search: search,
                    filter: "all",
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
            header: t("global.image"),
            accessor: (row) =>
                row.image ? (
                    <LightboxImage
                        src={`/${row.image}`}
                        alt={row.name}
                        className="h-12 w-full object-cover rounded"
                    />
                ) : (
                    <span className="text-gray-400 italic">-</span>
                ),
        },
        {
            header: t("global.name"),
            accessor: (row) =>
                i18n.language === "en"
                    ? row.name_en
                    : row.name_id,
        },
        { header: "Slug", accessor: "slug" },
        {
            header: "Status", accessor: (row) => (
                <StatusBadge value={row.is_active} />
            )
        },
        {
            header: t("global.actions"),
            accessor: (row) => {
                const mainCategories = ["Makanan", "Minuman", "Kudapan"];
                if (mainCategories.includes(row.name_id)) {
                    return (
                        <span className="text-xs text-gray-400 italic">
                            3 kategori utama tidak dapat diubah
                        </span>
                    );
                }
                return (
                    <TableActionButtons
                        onEdit={() => openEditModal(row)}
                        onDelete={() => openDeleteModal(row.id)}
                    />
                );
            },
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
                addButtonText={t("category.pageTitle")}
                AddModalContent={CreateUserModal}
                selectable={true}
                onDeleteSelected={handleDeleteSelected}
                isProcessing={isLoading}
            />

            <CreateUserModal isOpen={isModalOpen} onClose={toggleModal} setRefetch={setRefetch} />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                category={selectedCategory}
                setRefetch={setRefetch}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                title={t("category.deleteTitle", "Delete Category")}
                description={t("category.deleteDescription", "Are you sure you want to delete this ingredient? This action cannot be undone.")}
                deleteButtonText={t("category.deleteButton", "Delete Category")}
                isProcessing={isProcessing}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteSelectedModalOpen}
                onClose={() => setIsDeleteSelectedModalOpen(false)}
                onDelete={confirmDeleteSelected}
                title={t("category.deleteSelectedTitle", "Delete Selected Ingredients")}
                description={t("category.deleteSelectedDescription", "Are you sure you want to delete the selected ingredients? This action cannot be undone.")}
                deleteButtonText={t("category.deleteSelectedButton", "Delete Selected")}
                isProcessing={isProcessing}
            />
        </Card>
    );
};

export default CategoryTable;