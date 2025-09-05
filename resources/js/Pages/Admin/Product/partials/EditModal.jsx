import React from "react";
import { useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";
import { useTranslation } from "react-i18next";

const EditModal = ({
    isOpen,
    onClose,
    product,
    setRefetch,
}) => {
    if (!product) return null;

    const { t, i18n } = useTranslation();

    const { data, setData, put, processing, errors, reset } = useForm({
        name: product.name || "",
        hpp: product.hpp || "",
        margin_percent: product.margin_percent || "",
    });

    // Hitung harga jual otomatis
    const calculateSellPrice = () => {
        const hpp = parseFloat(data.hpp.toString().replace(",", ".")) || 0;
        const margin = parseFloat(data.margin_percent.toString().replace(",", ".")) || 0;
        return hpp + (hpp * margin / 100);
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "margin_percent") {
            // Ganti koma ke titik
            value = value.replace(",", ".");
            // Hanya angka dan titik
            value = value.replace(/[^0-9.]/g, "");
            // Batasi hanya satu titik
            const parts = value.split(".");
            if (parts.length > 2) {
                value = parts[0] + "." + parts[1];
            }
            // Batasi dua angka setelah titik
            if (parts[1]) {
                value = parts[0] + "." + parts[1].slice(0, 2);
            }
            // Maksimal 100
            if (parseFloat(value) > 100) {
                value = "100";
            }
            // Tidak boleh kurang dari 0
            if (value !== "" && parseFloat(value) < 0) {
                value = "0";
            }
        }

        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Pastikan margin_percent dikirim sebagai desimal (titik)
        const marginPercentValue = data.margin_percent
            ? data.margin_percent.toString().replace(",", ".")
            : "";

        router.post(`/admin/product/${product.id}`, {
            ...data,
            margin_percent: marginPercentValue,
            _method: "put",
        }, {
            onSuccess: () => {
                reset();
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalSuccess"),
                    text: t("product.updatedMessage", "Produk berhasil diupdate."),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal show={isOpen}
            onClose={onClose}
            title={t("product.pageTitle", "Edit Produk")}
            type="edit"
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
                        <InputLabel htmlFor="name" value={t("product.name", "Nama Produk")} required />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                            autoComplete="name"
                            placeholder={t("product.name", "Nama Produk")}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="hpp" value={t("product.hpp", "HPP (Harga Pokok Penjualan)")} required />
                        <TextInput
                            id="hpp"
                            name="hpp"
                            type="text"
                            value={data.hpp}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            min={0}
                            placeholder={t("product.hpp", "HPP")}
                            required
                        />
                        <InputError message={errors.hpp} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="margin_percent" value={t("product.margin_percent", "Margin (%)")} required />
                        <TextInput
                            id="margin_percent"
                            name="margin_percent"
                            type="text"
                            value={data.margin_percent}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                            min={0}
                            max={100}
                            placeholder={t("product.margin_percent", "Margin (%)")}
                        />
                        <InputError message={errors.margin_percent} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="sell_price" value={t("product.sell_price", "Harga Jual (Otomatis)")} />
                        <TextInput
                            id="sell_price"
                            name="sell_price"
                            type="number"
                            value={calculateSellPrice()}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                            placeholder={t("product.sell_price", "Harga Jual")}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default EditModal;