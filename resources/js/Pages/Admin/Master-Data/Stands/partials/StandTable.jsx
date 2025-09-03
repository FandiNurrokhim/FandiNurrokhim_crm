import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Table from "@/Layouts/Table";
import ConfirmDeleteModal from "@/Components/Molecules/ConfirmDeleteModal";
import CreateUserModal from "./CreateModal";
import EditModal from "./EditModal";
import Card from "@/Components/Atoms/Card";
import Rating from "@/Components/Atoms/Rating";
import LightboxImage from "@/Components/Atoms/LightboxImage";
import TableActionButtons from "@/Components/Molecules/TableActionButtons";
import LimitedText from "@/Components/Atoms/LimitedText";

// Utlis
import { getErrorMessage } from "@/Utils/getErrorMessage";

// Translate
import { useTranslation } from "react-i18next";
import { CheckCircleIcon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/solid";

const StandTable = () => {

    // Translation
    const { t, i18n } = useTranslation();

    const [data, setData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStand, setSelectedStand] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStandId, setSelectedStandId] = useState(null);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const openEditModal = (stand) => {
        axios
            .get(`/admin/stand/${stand.id}/edit`)
            .then((response) => {
                setSelectedStand(response.data.data);
                setIsEditModalOpen(true);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = error.response?.data?.message || "An error occurred.";
                Swal.fire(t('global.swalInfo'), errorMessage, "info");
            });
    };

    const closeEditModal = () => {
        setSelectedStand(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (standId) => {
        setSelectedStandId(standId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedStandId(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        setIsProcessing(true);
        axios
            .delete(`/admin/stand/${selectedStandId}`)
            .then(() => {
                setIsProcessing(false);
                setIsDeleteModalOpen(false);
                Swal.fire(
                    t("global.swalDeleted", "Deleted!"),
                    t("stand.deletedMessage", "Ingredient has been deleted."),
                    "success"
                );
                setRefetch((prev) => !prev);
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error, t, i18n.language);

                Swal.fire(
                    t("global.swalInfo", "Error!"),
                    errorMessage,
                    "info"
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
            .post(route('admin.stand.bulk-delete'), { ids: selectedIds })
            .then(() => {
                setIsProcessing(false);
                setIsDeleteSelectedModalOpen(false);
                Swal.fire("Deleted!", "Selected stand have been deleted.", "success");
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
            .get("/admin/stand/data", {
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
            header: t("global.name"),
            accessor: ('name'),
            className: "text-center",
        },
        {
            header: t("global.image"),
            accessor: (row) =>
                row.image ? (
                    <LightboxImage
                        src={`/${row.image}`}
                        alt={row.name}
                        className="h-12 w-12 object-cover rounded"
                    />
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
            header: t("global.foodSummary"),
            accessor: (row) => (
                <div className="flex flex-col items-center gap-1 text-sm">
                    <div className="w-full flex justify-between items-center gap-2">
                        <span className="text-gray-600 font-semibold">{t("global.total", "Total")}</span>
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full">
                            <ShoppingBagIcon className="w-4 h-4 text-blue-600" />
                            {row.total_foods}
                        </span>
                    </div>
                    <div className="w-full flex justify-between items-center gap-2">
                        <span className="text-gray-600 font-semibold">{t("global.active", "Active")}</span>
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-full">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            {row.total_active_foods}
                        </span>
                    </div>
                    <div className="w-full flex justify-between items-center gap-2">
                        <span className="text-gray-600 font-semibold">{t("global.inactive", "Inactive")}</span>
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded-full">
                            <XMarkIcon className="w-4 h-4 text-red-600" />
                            {row.total_not_active_foods}
                        </span>
                    </div>
                </div>
            ),
            className: "text-center",
        },
        {
            header: "Rating",
            className: "text-center",
            accessor: (row) => (
                <div className="flex justify-center">
                    <Rating rating={row.rating} userReviewCount={row.total_reviews_count} detailView={true} />
                </div>
            ),
        },
        {
            header: t("global.actions"),
            accessor: (row) => (
                <TableActionButtons
                    onEdit={() => openEditModal(row)}
                    onDelete={() => openDeleteModal(row.id)}
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
                addButtonText={t("stand.pageTitle")}
                AddModalContent={CreateUserModal}
                selectable={true}
                onDeleteSelected={handleDeleteSelected}
                isProcessing={isLoading}
            />

            <CreateUserModal isOpen={isModalOpen} onClose={toggleModal} setRefetch={setRefetch} />

            {selectedStand && (
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    stand={selectedStand}
                    setRefetch={setRefetch}
                />
            )}

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                title={t("stand.deleteTitle")}
                description={t("stand.deleteDescription")}
                deleteButtonText={t("stand.deleteButton")}
                isProcessing={isProcessing}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteSelectedModalOpen}
                onClose={() => setIsDeleteSelectedModalOpen(false)}
                onDelete={confirmDeleteSelected}
                title={t("stand.deleteSelectedTitle", "Delete Selected Ingredients")}
                description={t("stand.deleteSelectedDescription", "Are you sure you want to delete the selected ingredients? This action cannot be undone.")}
                deleteButtonText={t("stand.deleteSelectedButton", "Delete Selected")}
                isProcessing={isProcessing}
            />
        </Card>
    );
};

export default StandTable;