import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Select from "react-select";
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

const EditModal = ({ isOpen, onClose, deal, setRefetch }) => {
    const { t } = useTranslation();

    // State untuk dropdown
    const [leads, setLeads] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [dealProducts, setDealProducts] = useState([]);
    const [productErrors, setProductErrors] = useState([]);

    // Options untuk react-select
    const leadOptions = leads.map(lead => ({ value: lead.id, label: lead.name }));
    const customerOptions = customers.map(cust => ({ value: cust.id, label: cust.name }));
    const productOptions = products.map(prod => ({ value: prod.id, label: prod.name }));

    // Ambil data dropdown dan set data awal saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            axios.get("/admin/deal/dropdown-data-list").then(res => {
                setLeads(res.data.leads || []);
                setCustomers(res.data.customers || []);
                setProducts(res.data.products || []);
            });
            // Set produk dari deal yang sedang diedit
            setDealProducts(
                deal?.products?.map(item => ({
                    product_id: item.product_id || item.id,
                    qty: item.pivot?.qty ?? item.qty ?? 1,
                    negotiated_price: item.pivot?.negotiated_price ?? item.negotiated_price ?? "",
                })) || [{ product_id: "", qty: 1, negotiated_price: "" }]
            );
        }
    }, [isOpen, deal]);

    // Form state
    const { data, setData, processing, errors, reset } = useForm({
        lead_id: deal?.lead_id || "",
        customer_id: deal?.customer_id || "",
        title: deal?.title || "",
        notes: deal?.notes || "",
        status: deal?.status || "waiting_approval",
    });

    // Hitung total_amount
    const calculateTotal = () => {
        return dealProducts.reduce((sum, item) => {
            const qty = parseInt(item.qty) || 0;
            const price = parseFloat(item.negotiated_price) || 0;
            return sum + (qty * price);
        }, 0);
    };

    // Handle produk dinamis
    const handleProductChange = (idx, field, value) => {
        const updated = [...dealProducts];
        updated[idx][field] = value;
        setDealProducts(updated);
    };

    const addProductRow = () => {
        setDealProducts([...dealProducts, { product_id: "", qty: 1, negotiated_price: "" }]);
    };

    const removeProductRow = (idx) => {
        if (dealProducts.length > 1) {
            setDealProducts(dealProducts.filter((_, i) => i !== idx));
        }
    };

    // Validasi harga jual vs negotiated_price
    const validateProducts = () => {
        const errors = [];
        dealProducts.forEach((item, idx) => {
            const product = products.find(p => p.id == item.product_id);
            if (product && parseFloat(item.negotiated_price) < parseFloat(product.sell_price)) {
                errors[idx] = "Harga di bawah harga jual, perlu approval leader.";
            } else {
                errors[idx] = "";
            }
        });
        setProductErrors(errors);
        return errors.every(e => !e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateProducts()) {
            Swal.fire("Warning", "Ada harga produk di bawah harga jual. Perlu approval leader.", "warning");
        }
        router.post(`/admin/deal/${deal.id}`, {
            ...data,
            products: dealProducts.map(item => ({
                product_id: item.product_id,
                qty: Number(item.qty),
                negotiated_price: Number(item.negotiated_price),
            })),
            total_amount: calculateTotal(),
            _method: "put",
        }, {
            onSuccess: () => {
                reset();
                setDealProducts([{ product_id: "", qty: 1, negotiated_price: "" }]);
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: "Sukses",
                    text: "Deal berhasil diupdate.",
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <Modal show={isOpen}
            onClose={onClose}
            title="Edit Deal"
            type="edit"
            maxWidth="3xl"
            onCancel={() => {
                onClose();
                reset();
                setDealProducts(deal?.products?.map(item => ({
                    product_id: item.product_id || item.id,
                    qty: item.qty,
                    negotiated_price: item.negotiated_price,
                })) || [{ product_id: "", qty: 1, negotiated_price: "" }]);
            }}
            processing={processing}
            onSubmit={handleSubmit}
        >
            <div className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <InputLabel htmlFor="lead_id" value="Lead" required />
                        <Select
                            id="lead_id"
                            name="lead_id"
                            options={leadOptions}
                            value={leadOptions.find(opt => opt.value === data.lead_id) || null}
                            onChange={opt => setData("lead_id", opt ? opt.value : "")}
                            placeholder="Pilih Lead"
                            isClearable
                        />
                        <InputError message={errors.lead_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="customer_id" value="Customer" />
                        <Select
                            id="customer_id"
                            name="customer_id"
                            options={customerOptions}
                            value={customerOptions.find(opt => opt.value === data.customer_id) || null}
                            onChange={opt => setData("customer_id", opt ? opt.value : "")}
                            placeholder="Pilih Customer"
                            isClearable
                        />
                        <InputError message={errors.customer_id} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="title" value="Judul Deal" />
                        <TextInput
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={e => setData("title", e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Judul Deal"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="Produk & Harga" />
                        {dealProducts.map((item, idx) => {
                            const selectedProduct = products.find(p => p.id === item.product_id);
                            return (
                                <div key={idx} className="grid grid-cols-12 gap-3 items-start mb-3">
                                    {/* Produk */}
                                    <div className="col-span-4">
                                        <Select
                                            name="product_id"
                                            options={productOptions}
                                            value={productOptions.find(opt => opt.value === item.product_id) || null}
                                            onChange={opt => handleProductChange(idx, "product_id", opt ? opt.value : "")}
                                            placeholder="Pilih Produk"
                                            isClearable
                                        />
                                        <span className="text-xs text-gray-500">Harga Jual:</span>
                                        <span className="font-semibold ml-1">
                                            {selectedProduct
                                                ? Number(selectedProduct.sell_price).toLocaleString("id-ID", { style: "currency", currency: "IDR" })
                                                : "-"}
                                        </span>
                                    </div>
                                    {/* Qty */}
                                    <div className="col-span-2">
                                        <TextInput
                                            name="qty"
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            onChange={e => handleProductChange(idx, "qty", e.target.value)}
                                            placeholder="Qty"
                                            className="w-full"
                                        />
                                    </div>
                                    {/* Harga Nego */}
                                    <div className="col-span-4">
                                        <TextInput
                                            name="negotiated_price"
                                            type="number"
                                            min={0}
                                            value={item.negotiated_price}
                                            onChange={e => handleProductChange(idx, "negotiated_price", e.target.value)}
                                            placeholder="Harga Nego"
                                            className="w-full"
                                        />
                                    </div>
                                    {/* Tombol Hapus */}
                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeProductRow(idx)}
                                            className="p-1 text-red-500 hover:text-red-700 rounded-md border border-red-300 hover:bg-red-50"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {/* Error Message */}
                                    {productErrors[idx] && (
                                        <div className="col-span-12">
                                            <span className="text-xs text-yellow-600">{productErrors[idx]}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <button
                            type="button"
                            onClick={addProductRow}
                            className="text-blue-600 text-sm mt-2"
                        >
                            + Tambah Produk
                        </button>
                    </div>
                    <div>
                        <InputLabel value="Catatan" />
                        <TextInput
                            name="notes"
                            value={data.notes}
                            onChange={e => setData("notes", e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Catatan"
                        />
                    </div>
                    <div>
                        <InputLabel value="Total" />
                        <TextInput
                            name="total_amount"
                            value={calculateTotal()}
                            readOnly
                            className="mt-1 block w-full bg-gray-100"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditModal;