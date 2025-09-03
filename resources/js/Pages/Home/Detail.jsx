import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";

import FoodDetailBanner from "@/Components/Atoms/FoodDetailBanner";
import ProductTabs from "@/Components/Organisms/ProductTabs";

export default function Detail() {
    const product = usePage().props.product;

    return (
        <HomeLayout>
            <FoodDetailBanner
                image1={product.image}
                image2={product.image_2}
                image3={product.image_3}
                alt={product.name}
            />
            <ProductTabs
                product={product}
            />
        </HomeLayout>
    );
}