import React from "react";
import { router, useForm } from "@inertiajs/react";

import Swal from "sweetalert2";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ModalFooterActions from "@/Components/Molecules/ModalFooterActions";

// utils
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";

// Translate
import { useTranslation } from "react-i18next";
import UploadInputWithPreview from "@/Components/Molecules/UploadInputWithView";

const EditModal = ({ isOpen, onClose, ingredient, setRefetch }) => {
    if (!ingredient) {
        return null;
    }

    // Translation
    const { t, i18n } = useTranslation();

    const { data, setData, put, processing, errors, reset } = useForm({
        name_id: ingredient.name_id || "",
        name_en: ingredient.name_en || "",
        image: ingredient.image || null,
        message: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = { ...data, _method: "put" };
        // Hapus image jika bukan file (string/path lama)
        if (payload.image && typeof payload.image !== "object") {
            delete payload.image;
        }

        router.post(`/admin/ingredient/${ingredient.id}`, {
            ...payload,
            _method: "put",
        }, {
            onSuccess: () => {
                reset();
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalSuccess"),
                    text: t("ingredient.pageTitle") + " " + t("global.updatedMessage"),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                console.error("Error updating ingredient:", errors);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal show={isOpen}
            onClose={onClose}
            title={t("ingredient.pageTitle")}
            type="edit"
            maxWidth="2xl"
            onCancel={() => {
                onClose();
                reset();
            }}
            processing={processing}
            onSubmit={handleSubmit}>
                
            <div>
                <InputLabel htmlFor="name_id" value={`${t("global.name")} (ID)`} />
                <span className="text-xs text-gray-500">{t("global.nameIndonesian") || "Nama dalam Bahasa Indonesia"}</span>
                <TextInput
                    id="name_id"
                    name="name_id"
                    value={data.name_id}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    placeholder="Nasi"
                    required
                    autoComplete="name_id"
                />
                <InputError message={errors.name_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="name_en" value={`${t("global.name")} (EN)`} />
                <span className="text-xs text-gray-500">{t("global.nameEnglish") || "Name in English"}</span>
                <TextInput
                    id="name_en"
                    name="name_en"
                    value={data.name_en}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    placeholder="Rice"
                    required
                    autoComplete="name_en"
                />
                <InputError message={errors.name_en} className="mt-2" />
            </div>

            <UploadInputWithPreview
                id="image"
                name="image"
                label={t("global.image")}
                accept=".jpg,.jpeg,.png"
                maxSizeMB={0.5}
                onChange={e => setData("image", e.target.files[0] ?? null)}
                value={data.image}
                error={errors.image}
            />
        </Modal>
    );
};

export default EditModal;