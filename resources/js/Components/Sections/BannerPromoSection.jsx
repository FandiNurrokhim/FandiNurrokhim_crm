import { useMemo } from "react";
import { usePage, Link } from "@inertiajs/react";
import { getImageUrl } from "@/Utils/imageHelper";

export default function PromoBannerSection({ type = "event_top" }) {
    const bannersProp = usePage().props.banners || [];
    const pageBanners = useMemo(() => bannersProp.filter(b => b.type === "event"), [bannersProp]);

    // Pilih event sesuai type
    let selected = [];
    if (pageBanners.length >= 4) {
        if (type === "event_top") {
            selected = [pageBanners.find(b => b.title === "event1"), pageBanners.find(b => b.title === "event2")];
        } else {
            selected = [pageBanners.find(b => b.title === "event3"), pageBanners.find(b => b.title === "event4")];
        }
        selected = selected.filter(Boolean);
    }

    // Fallback dummy jika tidak ada data
    const banners = selected.length === 2
        ? selected.map(b => ({
            image: getImageUrl(b.image, b.title),
            alt: b.header || b.title,
            href: b.link || "#"
        }))
        : [
            {
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=cover&w=600&q=80",
                alt: "Ramadan Promo",
                href: "#"
            },
            {
                image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=cover&w=600&q=80",
                alt: "Free Shipping",
                href: "#"
            }
        ];

    return (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            {banners.map((banner, idx) => (
                <Link
                    key={idx}
                    href={banner.href || "#"}
                    target={banner.href && banner.href !== "#" ? "_blank" : undefined}
                    rel={banner.href && banner.href !== "#" ? "noopener noreferrer" : undefined}
                    className="rounded-xl overflow-hidden w-full h-20 sm:h-40 block"
                    style={{
                        backgroundImage: `url(${banner.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                    title={banner.alt || "Promo Banner"}
                />
            ))}
        </section>
    );
}