import React from "react";
import Swal from "sweetalert2";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Textarea } from "@material-tailwind/react";
import InputError from "@/Components/InputError";
import { Spinner } from "@material-tailwind/react";
import { getInertiaErrorMessage } from "@/Utils/getErrorMessage";
import { useTranslation } from "react-i18next";

import { ToastContainer, showToast } from "@/Components/Toast";

const ReviewModal = ({ isOpen, onClose, productId }) => {
    const { t, i18n } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: productId,
        rating: 5,
        comment: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/review", {
            onSuccess: () => {
                reset();
                onClose();
                showToast(t("global.reviewSuccessMessage"), "success");
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
        <>
            <Transition show={isOpen} leave="duration-200">
                <Dialog
                    as="div"
                    id="modal"
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
                    onClose={onClose}
                >
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="absolute inset-0 bg-black/80" />
                    </TransitionChild>

                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-xl  text-white p-6 text-center transition-all">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-lg font-semibold">{t("global.reviewTitle", "How was your experience?")}</h2>

                                {/* Rating Stars */}
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData("rating", star)}
                                            className="text-yellow-400 text-2xl focus:outline-none"
                                        >
                                            <i className={data.rating >= star ? "fas fa-star" : "far fa-star"}></i>
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.rating} className="text-red-400 text-sm mt-1" />

                                {/* Review Textarea */}
                                <div className="relative">
                                    <Textarea
                                        name="comment"
                                        maxLength={200}
                                        value={data.comment}
                                        onChange={handleChange}
                                        placeholder={t("global.reviewPlaceholder", "Write your review here...")}
                                        className="w-full bg-white rounded-xl p-3 text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows={3}
                                    />
                                    <div className="absolute bottom-2 right-3 text-xs text-gray-300">
                                        {data.comment.length}/200
                                    </div>
                                    <InputError message={errors.review} className="text-red-400 text-sm mt-1 text-left" />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 border bg-[#D9B36A] hover:bg-[#c2a061] align-center justify-center border-none gap-2 rounded-lg text-slate-700 dark:text-white hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-black hover:shadow transition duration-150 flex items-center"
                                    disabled={processing}
                                >
                                    {processing && (
                                        <span className="mr-2">
                                            <Spinner className="h-4 w-4 animate-spin" />
                                        </span>
                                    )}
                                    {processing ? t('global.processing') : t('global.save')}
                                </button>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </Dialog>
            </Transition>
            <ToastContainer />
        </>
    );
};

export default ReviewModal;