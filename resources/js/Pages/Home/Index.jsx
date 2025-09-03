import React, { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import HomeLayout from "@/Layouts/HomeLayout";

import { useTranslation } from "react-i18next";

import SkillsSection from "@/Components/Sections/SkillSection";
import ExperienceSection from "@/Components/Sections/ExperienceSection";
import EducationSection from "@/Components/Organisms/Portfolio/Education/EducationSection";
import ProjectsSection from "@/Components/Sections/ProjectSection";

export default function HomePage() {
    const { t } = useTranslation();

    const auth = usePage().props.auth;
    const isPreferenceStored = auth?.user?.isPreferenceStored ?? null;
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [ourSelectionProducts, setOurSelectionProducts] = useState([]);
    const [isLoadingOurSelection, setIsLoadingOurSelection] = useState(true);

    return (
        <HomeLayout>
            <ExperienceSection />
            <EducationSection />
            {/* <SkillsSection />
            <ProjectsSection /> */}
        </HomeLayout>
    );
}
