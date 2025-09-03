import React from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ActiveToggle from "@/Components/Atoms/ActiveToogle";
import UploadInputWithPreview from "@/Components/Molecules/UploadInputWithView";


// Utils
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";

// Translation
import { useTranslation } from "react-i18next";

const EditModal = ({ isOpen, onClose, setRefetch, stand }) => {
    const { t, i18n } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: stand?.name || "",
        image: stand?.image || null,
        description_id: stand?.description_id || "",
        description_en: stand?.description_en || "",
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


        router.post(`/admin/stand/${stand.id}`, {
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
                    text: t("stand.pageTitle") + " " + t("global.updatedMessage"),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                console.error("Error updating stand:", errors);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            title={t("stand.pageTitle")}
            type="edit"
            maxWidth="2xl"
            onCancel={() => {
                onClose();
                reset();
            }}
            processing={processing}
            onSubmit={handleSubmit}
        >
            <InputLabel htmlFor="name" value={`${t("global.name")}`}/>
            <TextInput
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="block w-full"
                placeholder={t('global.name')}
                required
                autoComplete="off"
            />
            <InputError message={errors.name} />

            <UploadInputWithPreview
                id="image"
                name="image"
                label={t("global.image")}
                accept=".jpg,.jpeg,.png"
                maxSizeMB={0.5}
                onChange={(e) => setData("image", e.target.files[0])}
                value={data.image}
                error={errors.image}
                required
            />

            <InputLabel htmlFor="description_id" value={`${t("global.description")} (ID)`} required/>
            <TextInput
                id="description_id"
                name="description_id"
                value={data.description_id}
                onChange={handleChange}
                className="block w-full"
                placeholder="Masukkan deskripsi dalam Bahasa Indonesia"
                autoComplete="off"
                required
            />
            <InputError message={errors.description_id} />

            <InputLabel htmlFor="description_en" value={`${t("global.description")} (EN)`} required/>
            <TextInput
                id="description_en"
                name="description_en"
                value={data.description_en}
                onChange={handleChange}
                className="block w-full"
                placeholder="Enter description in English"
                autoComplete="off"
                required
            />
            <InputError message={errors.description_en} />
        </Modal>
    );
};

export default EditModal;