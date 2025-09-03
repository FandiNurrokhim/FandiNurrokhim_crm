import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Table from "@/Layouts/Table";
import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import DangerButton from '@/Components/DangerButton';
import CreateUserModal from "./CreateModal";
import EditModal from "./EditModal";
import Card from "@/Components/Atoms/Card";
import LightboxImage from "@/Components/Atoms/LightboxImage";

// Utlis
import { getErrorMessage } from "@/Utils/getErrorMessage";

// Translate
import { useTranslation } from "react-i18next";

const IngredientTable = () => {

    // Translation
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedIngredient, setselectedIngredient] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedIngredientId, setselectedIngredientId] = useState(null);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const openEditModal = (ingredient) => {
        axios
            .get(`/admin/ingredient/${ingredient.id}/edit`)
            .then((response) => {
                setselectedIngredient(response.data.data);
                setIsEditModalOpen(true);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = error.response?.data?.message || "An error occurred.";
                Swal.fire("Error!", errorMessage, "error");
            });
    };

    const closeEditModal = () => {
        setselectedIngredient(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (ingredientId) => {
        setselectedIngredientId(ingredientId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setselectedIngredientId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setIsProcessing(true);
        axios
            .delete(`/admin/ingredient/${selectedIngredientId}`)
            .then(() => {
                setIsProcessing(false);
                setIsDeleteModalOpen(false);
                Swal.fire(
                    t("global.swalDeleted", "Deleted!"),
                    t("ingredient.deletedMessage", "Ingredient has been deleted."),
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
            .post(route('admin.ingredient.bulk-delete'), { ids: selectedIds })
            .then(() => {
                setIsProcessing(false);
                setIsDeleteSelectedModalOpen(false);
                Swal.fire(
                    t("global.swalDeleted", "Deleted!"),
                    t("ingredient.deletedMessage", "Ingredient has been deleted."),
                    "success"
                );
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
            .get("/admin/ingredient/data", {
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
            accessor: (row) =>
                i18n.language === "en"
                    ? row.name_en
                    : row.name_id,
        },
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
            header: t("global.actions"),
            accessor: (row) => (
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => openEditModal(row)}
                        className="inline-flex items-center rounded-md border border-transparent bg-yellow-400 px-2 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 active:bg-yellow-700"
                    >
                        <PencilIcon className="w-5 h-5 me-2 rounded-full bg-yellow-500 p-1 text-white" /> <span>{t("global.edit")}</span>
                    </button>
                    <DangerButton onClick={() => openDeleteModal(row.id)}>
                        <TrashIcon className="w-5 h-5 me-2 rounded-full bg-red-400 p-1 text-white" /> <span>{t("global.delete")}</span>
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
                addButtonText={t("ingredient.pageTitle", "Create Ingredient")}
                AddModalContent={CreateUserModal}
                selectable={true}
                onDeleteSelected={handleDeleteSelected}
                isProcessing={isLoading}
            />

            <CreateUserModal isOpen={isModalOpen} onClose={toggleModal} setRefetch={setRefetch} />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                ingredient={selectedIngredient}
                setRefetch={setRefetch}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                title={t("ingredient.pageTitle", "Delete Ingredient")}
                description={t("ingredient.deleteDescription", "Are you sure you want to delete this ingredient? This action cannot be undone.")}
                deleteButtonText={t("ingredient.pageTitle", "Delete Ingredient")}
                isProcessing={isProcessing}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteSelectedModalOpen}
                onClose={() => setIsDeleteSelectedModalOpen(false)}
                onDelete={confirmDeleteSelected}
                title={t("ingredient.deleteSelectedTitle", "Delete Selected Ingredients")}
                description={t("ingredient.deleteSelectedDescription", "Are you sure you want to delete the selected ingredients? This action cannot be undone.")}
                deleteButtonText={t("ingredient.deleteSelectedButton", "Delete Selected")}
                isProcessing={isProcessing}
            />
        </Card>
    );
};

export default IngredientTable;