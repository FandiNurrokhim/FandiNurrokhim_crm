import React, { useState, useRef, useEffect } from 'react';

const BannerUpload = ({ label, onFileChange, imagePreview }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(imagePreview || null);

  // Update preview jika imagePreview dari props berubah (misal dari server)
  useEffect(() => {
    setPreview(imagePreview || null);
  }, [imagePreview]);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Cek ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file tidak boleh lebih dari 2MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      if (onFileChange) {
        onFileChange(file, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div
        className={`w-full h-56 rounded-xl flex items-center justify-center bg-gray-600 text-white font-bold text-center relative overflow-hidden ${
          preview ? 'bg-cover bg-center' : ''
        }`}
        style={{
          backgroundImage: preview ? `url(${preview})` : 'none',
        }}
        onClick={handleChooseFile}
      >
        {!preview && (
          <span className="z-10 pointer-events-none">{label}</span>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={handleChooseFile}
          className="px-4 py-1 bg-gray-300 rounded-md font-semibold hover:bg-gray-400"
        >
          {preview ? 'Ganti Gambar' : 'Choose File'}
        </button>
      </div>
    </div>
  );
};

export default BannerUpload;