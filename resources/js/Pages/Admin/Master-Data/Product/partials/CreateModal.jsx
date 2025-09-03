import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "@inertiajs/react";
import Select from 'react-select';
import { Textarea } from "@material-tailwind/react";

import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import ActiveToggle from "@/Components/Atoms/ActiveToogle";
import UploadInputWithPreview from "@/Components/Molecules/UploadInputWithView";

// Utils
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";

// Translation
import { useTranslation } from "react-i18next";

const CreateModal = ({ isOpen, onClose, setRefetch }) => {
    const { t, i18n } = useTranslation();
    const [stands, setStands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        price: 0,
        description_id: "",
        description_en: "",
        portion_info: "",
        stand_id: "",
        categories: [],
        ingredients: [],
        is_active: false,
        image: "",
        image_2: "",
        image_3: "",
        message: "",
    });

    // Fetch stand options on modal open
    useEffect(() => {
        if (!isOpen) return;

        fetch("/admin/product/select-data")
            .then((res) => res.json())
            .then((result) => {
                setStands(result.data.stands || []);
                setCategories(result.data.categories || []);
                setIngredients(result.data.ingredients || []);
            })
            .catch(() => {
                Swal.fire("Error!", "Gagal mengambil data stand", "error");
            })
    }, [isOpen]);

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/admin/product", {
            onSuccess: () => {
                reset();
                onClose();
                setRefetch((prev) => !prev);
                Swal.fire({
                    icon: "success",
                    title: t("global.swalSuccess"),
                    text: t("product.pageTitle") + " " + t("global.createdMessage"),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    const standOptions = stands.map((stand) => ({
        value: stand.id,
        label: stand.name,
    }));
    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: i18n.language === "id" ? category.name_id : category.name_en,
    }));
    const ingredientOptions = ingredients.map((ingredient) => ({
        value: ingredient.id,
        label: i18n.language === "id" ? ingredient.name_id : ingredient.name_en,
    }));

    return (
        <Modal show={isOpen} onClose={onClose} title={t("product.pageTitle")}
            type="add"
            maxWidth="2xl"
            onCancel={() => {
                onClose();
                reset();
            }
            }
            processing={processing}
            onSubmit={handleSubmit}
        >
            <div className="flex gap-2">
                <div className="w-1/2">
                    <InputLabel htmlFor="name" value={`${t("global.name")}`} required />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                        autoComplete="off"
                        placeholder={`${t("global.name")} ${t("product.pageTitle")}`}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="w-1/2">
                    <InputLabel htmlFor="price" value={`${t("global.price")}`} required />
                    <TextInput
                        id="price"
                        name="price"
                        value={data.price}
                        type="number"
                        onChange={handleChange}
                        className="mt-1 block w-full"
                        required
                        autoComplete="off"
                        placeholder={`${t("global.price")} ${t("product.pageTitle")}`}
                    />
                    <InputError message={errors.price} className="mt-2" />
                </div>
            </div>

            <div className="w-full">
                <InputLabel htmlFor="portion_info" value={`${t("product.portionInfo")}`} required />
                <TextInput
                    id="portion_info"
                    name="portion_info"
                    value={data.portion_info}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                    autoComplete="off"
                    placeholder="1 porsi, 1 liter, 500 gram, dll."
                />
                <InputError message={errors.portion_info} className="mt-2" />
            </div>

            <UploadInputWithPreview
                id="image"
                name="image"
                label={t("global.image")}
                accept=".jpg,.jpeg,.png"
                maxSizeMB={0.2}
                onChange={(e) => setData("image", e.target.files[0])}
                value={data.image}
                error={errors.image}
                required
            />

            <UploadInputWithPreview
                id="image_2"
                name="image_2"
                label={t("global.image") + "2"}
                accept=".jpg,.jpeg,.png"
                maxSizeMB={0.2}
                onChange={(e) => setData("image_2", e.target.files[0])}
                value={data.image_2}
                error={errors.image_2}
                required
            />

            <UploadInputWithPreview
                id="image_3"
                name="image_3"
                label={t("global.image") + "3"}
                accept=".jpg,.jpeg,.png"
                maxSizeMB={0.2}
                onChange={(e) => setData("image_3", e.target.files[0])}
                value={data.image_3}
                error={errors.image_3}
                required
            />

            <div>
                <InputLabel htmlFor="stand_id" value="Stand" required />
                <Select
                    options={standOptions}
                    id="stand_id"
                    name="stand_id"
                    value={standOptions.find(option => option.value === data.stand_id) || null}
                    onChange={(selectedOption) => {
                        setData("stand_id", selectedOption ? selectedOption.value : "");
                    }}
                    placeholder={t("product.selectStand")}
                    isClearable
                    required
                />
            </div>
            <div>
                <InputLabel htmlFor="category_id" value={`${t("category.pageTitle")} (EN)`} required />
                <Select
                    options={categoryOptions}
                    id="category_id"
                    name="category_id"
                    isMulti
                    value={categoryOptions.filter(option => data.categories.includes(option.value))}
                    onChange={selectedOptions => {
                        setData("categories", selectedOptions ? selectedOptions.map(opt => opt.value) : []);
                    }}
                    placeholder={t("product.selectCategory")}
                    isClearable
                    required
                />
            </div>
            <div>
                <InputLabel htmlFor="ingredient_id" value={`${t("ingredient.pageTitle")} (EN)`} required />
                <Select
                    options={ingredientOptions}
                    id="ingredient_id"
                    name="ingredient_id"
                    isMulti
                    value={ingredientOptions.filter(option => data.ingredients.includes(option.value))}
                    onChange={selectedOptions => {
                        setData("ingredients", selectedOptions ? selectedOptions.map(opt => opt.value) : []);
                    }}
                    placeholder={t("product.selectIngredients")}
                    isClearable
                    required
                />
            </div>

            <div>
                <InputLabel htmlFor="description_id" value={`${t("global.description")} (ID)`} required />
                <Textarea
                    name="description_id"
                    id="description_id"
                    value={data.description_id}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={handleChange}
                    placeholder={t("global.description") + " " + t("global.inId")}
                    required
                />
                <InputError message={errors.description_id} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description_en" value={`${t("global.description")} (EN)`} required />
                <Textarea
                    name="description_en"
                    id="description_en"
                    value={data.description_en}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={handleChange}
                    placeholder={t("global.description") + " " + t("global.inEn")}
                    required
                />
                <InputError message={errors.description_en} className="mt-2" />
            </div>


            <ActiveToggle
                value={data.is_active}
                onChange={(val) => setData("is_active", val)}
                required
            />
            <InputError message={errors.is_active} className="mt-2" />
        </Modal>
    );
};

export default CreateModal;
