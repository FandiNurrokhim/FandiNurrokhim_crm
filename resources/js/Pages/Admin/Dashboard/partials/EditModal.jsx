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

const EditModal = ({ isOpen, onClose, partner, setRefetch }) => {
    if (!partner) {
        return null;
    }

    // Translation
    const { t, i18n } = useTranslation();

    const { data, setData, put, processing, errors, reset } = useForm({
        name: partner.name || "",
        image: partner.image || null,
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

        router.post(`/admin/partner/${partner.id}`, {
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
                    text: t("partner.pageTitle") + " " + t("global.updatedMessage"),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                console.error("Error updating partner:", errors);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal show={isOpen}
            onClose={onClose}
            title={t("partner.pageTitle")}
            type="edit"
            maxWidth="2xl"
            onCancel={() => {
                onClose();
                reset();
            }}
            processing={processing}
            onSubmit={handleSubmit}>
                
            <div>
                <InputLabel htmlFor="name" value={`${t("global.name")}`} />
                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                    autoComplete="name"
                    placeholder={t("global.name")}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <UploadInputWithPreview
                id="image"
                name="image"
                label="Logo"
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