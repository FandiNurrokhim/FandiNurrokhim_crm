import React, { useEffect, useMemo, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import BannerInput from '@/Components/Molecules/BannerInput';
import BannerEvent from '@/Components/Molecules/BannerEvent';
import HomeCarousel from '@/Components/Organisms/HomeCarousel';
import { useTranslation } from 'react-i18next';

const eventKeys = ['event1', 'event2', 'event3', 'event4'];
const bannerSlider = ['Our Choice', 'Recommendation'];
const bannerMain = ['Makanan', 'Minuman', 'Kudapan'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;


const BannerPage = ({ banners }) => {
  const { t } = useTranslation();

  const getImageUrl = (title) => {
    const banner = banners?.find((b) => b.title === title);
    if (banner?.image) {
      const parts = banner.image.split('/');
      const filename = encodeURIComponent(parts.pop());
      return `/storage/${parts.join('/')}/${filename}`;
    }
    return '';
  };

  const initializeBannerMainPreview = () =>
    bannerMain.map(label => ({
      label,
      image: getImageUrl(`banner_${label.toLowerCase()}`)
    }));

  const initializeSliderPreview = () =>
    bannerSlider.map(label => {
      const key = label.toLowerCase().replace(/\s+/g, '_');
      return {
        label,
        key, // TAMBAHKAN: key untuk mapping
        image: getImageUrl(`banner_${key}`), // PERBAIKI: tambahkan 'banner_' prefix
      };
    });

  const initializeEventData = () => {
    const result = {};
    eventKeys.forEach((key) => {
      const banner = banners?.find(b => b.title === key) || {};
      result[key] = {
        file: null,
        header: banner.header || '',
        text: banner.text || '',
        link: banner.link || '',
        imagePreview: getImageUrl(key),
      };
    });
    return result;
  };

  const [previewBanners, setPreviewBanners] = useState(initializeBannerMainPreview);
  const [sliderPreview, setSliderPreview] = useState(initializeSliderPreview);
  const [eventBanners, setEventBanners] = useState(initializeEventData);

  const { data, setData, processing, errors, reset } = useForm({
    ...Object.fromEntries(bannerMain.map(label => [`banner_${label.toLowerCase()}`, null])),
    // PERBAIKI: slider data initialization
    ...Object.fromEntries(bannerSlider.map(label => {
      const key = label.toLowerCase().replace(/\s+/g, '_');
      return [key, banners?.find(b => b.title === `banner_${key}`)?.image || null];
    })),
    ...Object.fromEntries(eventKeys.flatMap(key => [
      [`header_${key}`, banners?.find(b => b.title === key)?.header || ''],
      [`text_${key}`, banners?.find(b => b.title === key)?.text || ''],
      [`link_${key}`, banners?.find(b => b.title === key)?.link || ''],
    ])),
    ...Object.fromEntries(eventKeys.map(key => [key, null])),
  });

  useEffect(() => {
    setPreviewBanners(initializeBannerMainPreview());
    setSliderPreview(initializeSliderPreview());
    setEventBanners(initializeEventData());
  }, [banners]);

  const handleBannerMainChange = (label, file, preview) => {
    const name = `banner_${label.toLowerCase()}`;
    setPreviewBanners(prev =>
      prev.map(item => item.label === label ? { ...item, image: preview } : item)
    );
    setData(name, file);
  };

  const isFileValid = (file) => {
    return file && file.size <= MAX_FILE_SIZE;
  };


  // PERBAIKI: handleSliderChange
  const handleSliderChange = (label, file, preview) => {
    const key = label.toLowerCase().replace(/\s+/g, '_');
    setSliderPreview(prev =>
      prev.map(item => item.key === key ? { ...item, image: preview } : item) // PERBAIKI: gunakan item.key
    );
    setData(key, file);
  };

  const handleEventChange = ({ name, file, preview }) => {
    setEventBanners(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        file,
        imagePreview: preview,
      },
    }));
    setData(name, file || null);
  };

  const handleEventFieldChange = (e) => {
    const { name, value } = e.target;
    const [field, key] = name.split('_');
    setEventBanners(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
    setData(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isBannerMainValid = bannerMain.every((label) =>
      previewBanners.find(b => b.label === label)?.image
    );
    const isEvent12Valid = ['event1', 'event2'].every(key =>
      eventBanners[key].file || eventBanners[key].imagePreview
    );

    if (!isBannerMainValid || !isEvent12Valid) {
      Swal.fire({
        icon: 'info',
        title: 'Lengkapi Gambar',
        text: 'Minimal semua banner utama dan event 1 & 2 harus diisi sebelum submit.',
      });
      return;
    }

    // Validasi ukuran file
    const allFiles = [
      ...bannerMain.map(b => data[`banner_${b.toLowerCase()}`]),
      ...bannerSlider.map(s => {
        const key = s.toLowerCase().replace(/\s+/g, '_');
        return data[key];
      }),
      ...eventKeys.map(k => data[k]),
    ].filter(Boolean); // Hanya ambil file yang ada

    const largeFiles = allFiles.filter(file => file && !isFileValid(file));

    if (largeFiles.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar',
        text: `Ukuran file tidak boleh melebihi ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    // Bagi data menjadi dua batch
    const firstBatch = new FormData();
    const secondBatch = new FormData();

    let batchSwitch = false; // ganti ke true setelah separuh

    const keys = Object.keys(data);
    const midpoint = Math.ceil(keys.length / 2);

    keys.forEach((key, i) => {
      const value = data[key];
      const batch = i < midpoint ? firstBatch : secondBatch;

      if (
        value !== null &&
        (value instanceof File || typeof value === 'string')
      ) {
        batch.append(key, value);
      }
    });

    const uploadBatch = async (batch, step) => {
      return new Promise((resolve, reject) => {
        Swal.fire({
          title: `Mengupload bagian ${step}...`,
          html: 'Mohon tunggu sebentar.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        router.post('/admin/setting', batch, {
          forceFormData: true,
          onSuccess: () => {
            Swal.close();
            resolve();
          },
          onError: () => {
            Swal.fire({ icon: 'error', title: `Gagal upload bagian ${step}` });
            reject();
          },
        });
      });
    };

    try {
      await uploadBatch(firstBatch, 1);
      await uploadBatch(secondBatch, 2);

      reset();
      Swal.fire({ icon: 'success', title: 'Semua data berhasil diunggah!' });
    } catch (e) {
      // Error sudah ditangani masing-masing
    }
  };

  // TAMBAHKAN: Debug logging
  console.log('Banner Debug:', {
    sliderPreview,
    data,
    errors
  });

  return (
    <form className="p-4 space-y-6" onSubmit={handleSubmit}>
      {/* Banner Utama */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bannerMain.map((label, index) => (
            <BannerInput
              key={label}
              label={`Banner ${label}`}
              name={`banner_${label.toLowerCase()}`}
              value={previewBanners[index].image}
              error={errors[`banner_${label.toLowerCase()}`]}
              onChange={(file, preview) => handleBannerMainChange(label, file, preview)}
            />
          ))}
        </div>
        <div className="container">
          <HomeCarousel isPreview={true} previewBanners={previewBanners} />
        </div>
      </div>

      {/* Our Choice & Recommendation */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sliderPreview.map(({ label, key, image }, index) => (
            <BannerInput
              key={key} // PERBAIKI: gunakan key yang unik
              label={`Banner ${label}`}
              name={key}
              value={image}
              error={errors[key]}
              onChange={(file, preview) => handleSliderChange(label, file, preview)}
            />
          ))}
        </div>
      </div>

      {/* Event Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {eventKeys.map((key, index) => (
          <BannerEvent
            key={key}
            label={`Event ${index + 1}`}
            name={key}
            onChange={handleEventChange}
            header={eventBanners[key].header}
            text={eventBanners[key].text}
            link={eventBanners[key].link}
            imagePreview={eventBanners[key].imagePreview}
            onFieldChange={handleEventFieldChange}
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-[#D9B36A] text-[#0E1C2D] hover:bg-[#caa45f] rounded-md w-full px-4 py-1.5 text-lg font-semibold transition"
        disabled={processing}
      >
        {t("global.save")}
      </button>
    </form>
  );
};

export default BannerPage;