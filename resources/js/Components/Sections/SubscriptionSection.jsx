import { useState } from "react";

export default function SubscriptionSection() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const { post, reset } = useForm({
        email: "",
    });

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
                    text: t("product.createdMessage"),
                });
            },
            onError: (errors) => {
                const errorMessage = getInertiaErrorMessage(errors.message, i18n.language);
                Swal.fire("Error!", errorMessage, "error");
            },
        });
    };

    return (
        <section className="bg-[#1B3A1A] rounded-xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
            <div className="max-w-lg text-white">
                <h2 className="font-semibold text-xl sm:text-2xl leading-snug mb-4">
                    Get update regularly and best offer subscribe us
                </h2>
                <form className="flex max-w-md gap-2" onSubmit={handleSubmit}>
                    <input
                        className="flex-grow rounded-full px-4 py-2 text-gray-900 focus:outline-none"
                        placeholder="Enter your email address"
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-2 transition"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Subscribe"}
                    </button>
                </form>
                {success && <div className="text-green-300 mt-2 text-sm">Berhasil subscribe!</div>}
                {error && <div className="text-red-300 mt-2 text-sm">{error}</div>}
            </div>
            <img
                alt="Chef wearing white uniform holding fresh green vegetables and a red tomato"
                className="w-40 h-40 rounded-full object-cover"
                height="160"
                src="https://storage.googleapis.com/a1aa/image/f3e78d9b-6d81-4da2-e14b-33b27087a7a3.jpg"
                width="160"
            />
        </section>
    );
}