import React from "react";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import Modal from '@/Components/Modal';
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

// Utils
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";

// Translation
import { useTranslation } from "react-i18next";

const CreateModal = ({ isOpen, onClose, setRefetch }) => {
    // Translation
    const { t, i18n } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        contact: "",
        address: "",
        needs: "",
        status: "new",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/lead", {
            onSuccess: () => {
                reset();
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalSuccess"),
                    text: t("lead.createdMessage", "Lead has been created."),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} title={t("lead.pageTitle", "Tambah Lead")}
            type="add"
            maxWidth="2xl"
            onCancel={() => {
                onClose();
                reset();
            }}
            processing={processing}
            onSubmit={handleSubmit}
        >
            <div className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <InputLabel htmlFor="name" value={t("lead.name", "Nama Lead")} required />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                            autoComplete="name"
                            placeholder={t("lead.name", "Nama Lead")}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="contact" value={t("lead.contact", "Kontak")} />
                        <TextInput
                            id="contact"
                            name="contact"
                            value={data.contact}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            autoComplete="contact"
                            placeholder={t("lead.contact", "Kontak")}
                        />
                        <InputError message={errors.contact} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="address" value={t("lead.address", "Alamat")} />
                        <TextInput
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            autoComplete="address"
                            placeholder={t("lead.address", "Alamat")}
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="needs" value={t("lead.needs", "Kebutuhan")} />
                        <TextInput
                            id="needs"
                            name="needs"
                            value={data.needs}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            autoComplete="needs"
                            placeholder={t("lead.needs", "Kebutuhan")}
                        />
                        <InputError message={errors.needs} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="status" value={t("lead.status", "Status")} />
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="new">{t("lead.status_new", "Baru")}</option>
                            <option value="contacted">{t("lead.status_contacted", "Sudah Dihubungi")}</option>
                            <option value="qualified">{t("lead.status_qualified", "Qualified")}</option>
                            <option value="unqualified">{t("lead.status_unqualified", "Unqualified")}</option>
                            <option value="converted">{t("lead.status_converted", "Converted")}</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateModal;