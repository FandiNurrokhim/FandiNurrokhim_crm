import React from "react";
import { useTranslation } from "react-i18next";
import InputLabel from "@/Components/InputLabel";

const ActiveToggle = ({ value, onChange, name = "is_active", required = false }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            <InputLabel htmlFor={name} value="Status" required/>
            <span className="text-xs text-gray-500 mb-1">
                {t("global.selectedStatus")}:{" "}
                <span className="font-semibold">
                    {value === true || value === 1
                        ? t("global.active")
                        : t("global.inactive")}
                </span>
            </span>
            <div
                role="radiogroup"
                aria-label="Status"
                className="inline-flex rounded-md mt-2"
            >
                <button
                    type="button"
                    role="radio"
                    aria-checked={value === true || value === 1}
                    data-value="true"
                    className={`option px-6 py-2 cursor-pointer border border-gray-200 rounded-l-md transition-colors focus:outline-none ${value === true || value === 1
                        ? "text-white bg-blue-600 hover:bg-blue-700"
                        : "text-gray-600 hover:bg-blue-100"
                        }`}
                    onClick={() => onChange(true)}
                    id={`${name}-active`}
                >
                    {t("global.active")}
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={value === false || value === 0}
                    data-value="false"
                    className={`option px-6 py-2 cursor-pointer border border-gray-200 rounded-r-md transition-colors focus:outline-none ${value === false || value === 0
                        ? "text-white bg-blue-600 hover:bg-blue-700"
                        : "text-gray-600 hover:bg-blue-100"
                        }`}
                    onClick={() => onChange(false)}
                    id={`${name}-inactive`}
                >
                    {t("global.inactive")}
                </button>
            </div>
        </div>
    );
};

export default ActiveToggle;