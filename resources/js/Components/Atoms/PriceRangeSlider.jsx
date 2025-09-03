import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useTranslation } from "react-i18next";

export default function PriceRangeSlider({ min = 0, max = 10000, value, onChange, disabled }) {
  const [range, setRange] = useState(value || [min, max]);
  const { t } =  useTranslation();

  const handleSliderChange = (newRange) => {
    setRange(newRange);
    onChange && onChange(newRange);
  };

  const handleInputChange = (index, val) => {
    const newRange = [...range];
    newRange[index] = Number(val);
    setRange(newRange);
    onChange && onChange(newRange);
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-semibold mb-2">{t("global.priceRange")}</p>
      <div className="px-2">
        <Slider
          range
          min={min}
          max={max}
          value={range}
          onChange={handleSliderChange}
          trackStyle={[{ backgroundColor: "#86efac" }]}
          handleStyle={[
            { borderColor: "#86efac", backgroundColor: "#86efac" },
            { borderColor: "#86efac", backgroundColor: "#86efac" },
          ]}
          railStyle={{ backgroundColor: "#e5e7eb" }}
          dotStyle={{ backgroundColor: "#86efac" }}
          activeDotStyle={{ backgroundColor: "#16a34a" }}
          disabled={disabled}
        />
        <div className="flex justify-between mt-3">
          <input
            type="number"
            value={range[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="border px-2 py-1 w-20 rounded text-center"
            disabled={disabled}
          />
          <input
            type="number"
            value={range[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="border px-2 py-1 w-20 rounded text-center"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}