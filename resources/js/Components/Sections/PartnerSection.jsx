import React, { useEffect, useState } from "react";
import { getImageUrl } from "@/Utils/imageHelper";
import Marquee from "react-fast-marquee";

export default function PartnerSection() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners")
      .then(res => res.json())
      .then(data => {
        let fetchedPartners = data.partners;

        if (fetchedPartners.length > 0 && fetchedPartners.length < 4) {
          const repeatCount = Math.ceil(9 / fetchedPartners.length);
          fetchedPartners = Array(repeatCount)
            .fill(fetchedPartners)
            .flat()
            .slice(0, 9);
        }

        setPartners(fetchedPartners);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {
        partners.length > 0 && (
          <section className="bg-gray-50 py-8">
            <Marquee pauseOnHover={true} speed={50} gradient={true}>
              {partners.map((partner, index) => (
                <img
                  key={index}
                  src={getImageUrl(partner.image)}
                  alt={partner.name}
                  className="lg:h-10 h-5 mx-6"
                />
              ))}
            </Marquee>
          </section>
        )
      }
    </>
  );
}
