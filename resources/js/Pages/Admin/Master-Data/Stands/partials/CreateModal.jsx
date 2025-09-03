import React from "react";
import Swal from "sweetalert2";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ModalFooterActions from "@/Components/Molecules/ModalFooterActions";
import ActiveToggle from "@/Components/Atoms/ActiveToogle";
import UploadInputWithPreview from "@/Components/Molecules/UploadInputWithView";


// Utils
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";

// Translation
import { useTranslation } from "react-i18next";

const CreateModal = ({ isOpen, onClose, setRefetch }) => {
    const { t, i18n } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        image: "",
        description_id: "",
        description_en: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/stand", {
            onSuccess: () => {
                reset();
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalSuccess"),
                    text: t("stand.createdMessage"),
                });
            },
            onError: (errors) => {
                const lang = i18n.language;
                const errorMessage = getInertiaErrorMessage(errors.message, lang);
                Swal.fire({
                    icon: "error",
                    title: t("global.swalError"),
                    text: errorMessage,
                });
            },
        });
    };


    return (
        <Modal show={isOpen} onClose={onClose} title={t("stand.pageTitle")}
            type="add"
            maxWidth="2xl"
            onCancel={
                () => {
                    onClose();
                    reset();
                }
            }
            processing={processing}
            onSubmit={handleSubmit}>
            <InputLabel htmlFor="name" value={`${t("global.name")}`} required/>
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
        </Modal >
    );
};

export default CreateModal;
