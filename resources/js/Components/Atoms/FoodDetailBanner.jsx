import { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { getImageUrl } from "@/Utils/imageHelper";
import ColorThief from "colorthief";
import "keen-slider/keen-slider.min.css";
import Logo from "../../../../public/assets/Logo/Logo.jpg";

export default function FoodDetailBanner({ image1, image2, image3, alt = "Fruit Image" }) {
    const images = [image1, image2, image3].filter(Boolean);
    const imgRefs = useRef([]);
    const [bgGradient, setBgGradient] = useState(
        "linear-gradient(rgb(209, 220, 176), rgb(199, 211, 163))"
    );
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slideChanged(slider) {
            if (slider.track && slider.track.details) {
                updateBg(slider.track.details.rel);
            }
        },
        created(slider) {
            if (slider.track && slider.track.details) {
                updateBg(slider.track.details.rel);
            }
        },
    });

    // Auto slide every 3 seconds
    useEffect(() => {
        if (!instanceRef.current) return;
        const interval = setInterval(() => {
            instanceRef.current.next();
        }, 3000);
        return () => clearInterval(interval);
    }, [instanceRef]);

    // Update background gradient based on current image
    const updateBg = (idx) => {
        const img = imgRefs.current[idx];
        if (!img) return;
        if (img.complete) {
            try {
                const colorThief = new ColorThief();
                let palette = colorThief.getPalette(img, 6); // Ambil lebih banyak warna
                // Hitung brightness untuk tiap warna
                const brightness = c => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
                // Filter hanya warna terang (brightness > 180, bisa disesuaikan)
                palette = palette.filter(c => brightness(c) > 180);
                // Urutkan dari paling terang ke kurang terang
                palette.sort((a, b) => brightness(b) - brightness(a));
                // Ambil warna paling terang
                const topColor = palette[0];

                if (topColor) {
                    setBgGradient(
                        `linear-gradient(rgb(${topColor.join(",")}), rgb(245,245,245))`
                    );
                } else {
                    // fallback jika tidak ada warna terang
                    setBgGradient(
                        "linear-gradient(rgb(209, 220, 176), rgb(245,245,245))"
                    );
                }
            } catch {
                setBgGradient(
                    "linear-gradient(rgb(209, 220, 176), rgb(245,245,245))"
                );
            }
        } else {
            img.onload = () => updateBg(idx);
        }
    };

    // Reset bg when images change
    useEffect(() => {
        setBgGradient("linear-gradient(rgb(209, 220, 176), rgb(199, 211, 163))");
    }, [image1, image2, image3]);

    return (
        <div
            className="flex max-w-7xl mx-auto h-[60vh] items-center justify-center gap-8 transition-colors duration-500"
            style={{ background: bgGradient }}
        >
            <div ref={sliderRef} className="keen-slider">
                {images.map((img, idx) => (
                    <div
                        className="keen-slider__slide px-5 aspect-[4/3] flex flex-col items-center justify-center relative"
                        key={idx}
                    >
                        <img
                            ref={el => imgRefs.current[idx] = el}
                            src={getImageUrl(img)}
                            alt={alt}
                            // Ubah ukuran gambar di sini:
                            className="object-cover rounded-2xl w-[350px] h-[260px] transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}