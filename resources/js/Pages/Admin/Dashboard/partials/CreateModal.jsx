import React from "react";
import Swal from "sweetalert2";
import Modal from '@/Components/Modal';
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

import UploadInputWithPreview from "@/Components/Molecules/UploadInputWithView";

// Utils
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";

// Translation
import { useTranslation } from "react-i18next";

const CreateModal = ({ isOpen, onClose, setRefetch }) => {

    // Translation
    const { t, i18n } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        image: "",
        message: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/partner", {
            onSuccess: () => {
                reset();
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalSuccess"),
                    text: t("partner.createdMessage"),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} title={t("partner.create")}
            type="add"
            maxWidth="2xl"
            onCancel={() => {
                onClose();
                reset();
            }
            }
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
                    onChange={e => setData("image", e.target.files[0])}
                    value={data.image}
                    error={errors.image}
                />
        </Modal>
    );
};

export default CreateModal;
