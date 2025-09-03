import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const BannerInput = ({
  label,
  name,
  value,
  error,
  onChange,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (onChange) onChange(file, ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (onChange) onChange(null, "");
    }
  };

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    if (onChange) onChange(null, "");
  };

  return (
    <div>
      <label className="block text-sm mb-1 font-semibold">{label}</label>
      {!value ? (
        <label className="relative flex items-center w-full border border-gray-200 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600 cursor-pointer">
          <span className="inline-flex items-center justify-center mr-2">
            <img src="/assets/icons/upload.svg" alt="Upload Icon" className="h-6 w-6" />
          </span>
          <div className="font-medium text-gray-500 bg-gray-300 rounded-md px-3 py-1 hover:bg-blue-600 hover:text-white cursor-pointer">
            Pilih File
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            name={name}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="ml-4 text-xs text-gray-400 select-none pointer-events-none">
            {t("global.noFileSelected")}
          </span>
        </label>
      ) : (
        <div className="flex items-center border border-gray-300 rounded-md p-2 text-xs text-green-600">
          <span className="inline-flex items-center justify-center mr-2">
            <img src="/assets/icons/upload.svg" alt="Upload Icon" className="h-6 w-6" />
          </span>
          <span className="flex-1">{t("global.fileUploaded")}</span>
          <button
            type="button"
            className="text-red-600 hover:text-red-800 ml-2"
            title="Hapus file"
            onClick={handleRemove}
          >
            <svg className="h-5 w-5 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {value && (
        <img
          src={value}
          alt={`Preview ${label}`}
          className="mt-2 rounded shadow max-h-32"
        />
      )}
      {error && (
        <div className="text-red-600 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default BannerInput;