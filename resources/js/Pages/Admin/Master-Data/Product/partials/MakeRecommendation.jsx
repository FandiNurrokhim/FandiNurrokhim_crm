import React from "react";
import ManageDishes from "@/Components/Molecules/ManageDishes";

const ManualRecommendation = ({ manualRecommendations }) => {
    return (
        <>
            <ManageDishes recommendations={manualRecommendations} />
        </>
    );
};

export default ManualRecommendation;