import { t } from "i18next";
import { CubeIcon } from "@heroicons/react/24/outline";

export default function EmptyProductPlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-6 flex items-center justify-center mb-4">
                <CubeIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-gray-500 text-lg font-medium">
                {t("product.notFound")}
            </div>
        </div>
    );
}