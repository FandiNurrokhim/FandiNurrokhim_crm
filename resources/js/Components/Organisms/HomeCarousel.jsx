import React, { useRef, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { getImageUrl } from "@/Utils/imageHelper";

const defaultBanners = [
  { label: "Makanan", bg: "bg-gradient-to-r from-yellow-400 to-[#D9B36A]" },
  { label: "Minuman", bg: "bg-gradient-to-r from-blue-300 to-blue-500" },
  { label: "Kudapan", bg: "bg-gradient-to-r from-green-300 to-green-500" },
];

const zoomOut = (slider) => {
  function scale() {
    slider.slides.forEach((slide, idx) => {
      const abs = Math.abs(slider.track.details.rel - idx);
      slide.style.transform = `scale(${1 - abs * 0.15})`;
    });
  }
  slider.on("detailsChanged", scale);
  slider.on("created", scale);
};

// Tambahkan props previewBanners dan isPreview
const HomeCarousel = ({ previewBanners = [], isPreview = false }) => {
  const pageBanners = (usePage().props.banners || []).filter(b => b.type === "hero");
  // Jika preview, urutkan sesuai defaultBanners
  let banners = [];
  if (isPreview && previewBanners.length > 0) {
    banners = defaultBanners.map(def => {
      const found = previewBanners.find(pb => pb.label === def.label);
      return found
        ? { ...def, ...found }
        : def;
    });
  } else {
    banners = pageBanners.length > 0 ? pageBanners : defaultBanners;
  }

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1.2, spacing: 24 },
    mode: "free-snap",
    renderMode: "performance",
    created() {
      autoSwitch();
    },
    slideChanged() {
      autoSwitch();
    },
  }, [zoomOut]);

  const timeout = useRef();
  const autoSwitch = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 3000);
  };

  useEffect(() => {
    autoSwitch();
    return () => clearTimeout(timeout.current);
  }, []);

  return (
    <div className="relative px-2 py-2">
      <div ref={sliderRef} className="keen-slider rounded-xl md:h-[320px] h-[160px]">
        {banners.map((banner, idx) => (
          <Link
            key={banner.id || idx}
            href={
              isPreview
                ? "#"
                : banner.link ||
                (banner.label
                  ? route('home.search', { category: banner.label })
                  : "#")
            }
            target={banner.link && banner.link !== "#" ? "_blank" : undefined}
            rel={banner.link && banner.link !== "#" ? "noopener noreferrer" : undefined}
            className="keen-slider__slide flex justify-center items-center rounded-xl overflow-hidden "
            style={{ minWidth: 0 }}
          >
            {banner.image ? (
              <img
                src={
                  isPreview
                    ? banner.image 
                    : getImageUrl(banner.image, banner.title)
                }
                alt={banner.title || banner.label}
                className="w-full h-40 md:h-80 object-cover rounded-xl transition-transform duration-500"
              />
            ) : (
              <div
                className={`w-full h-40 md:h-80 flex justify-center items-center rounded-xl text-3xl font-bold text-[#0E1C2D] ${banner.bg}`}
              >
                {banner.title || banner.label}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Navigasi bulat */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${instanceRef.current?.track?.details?.rel === idx
              ? "bg-[#D9B36A]"
              : "bg-white opacity-60"
              }`}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;