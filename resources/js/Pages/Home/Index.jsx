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

    const syncPreferencesToServer = async (auth, isPreferenceStored) => {
        const prefs = localStorage.getItem("preferences");
        if (!auth?.user || isPreferenceStored || !prefs) return;

        const parsedPrefs = JSON.parse(prefs);
        try {
            await axios.post("/api/user/preference", {
                categories: parsedPrefs.categories,
                ingredients: parsedPrefs.ingredients,
                budget: parsedPrefs.budget,
            });
            console.log("Preferences synced to server.");
        } catch (err) {
            console.error("Failed to sync preferences:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data || []);
        } catch {
            setCategories([]);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchOurSelection = async () => {
        try {
            setIsLoadingOurSelection(true);
            const res = await axios.get("/api/our-selection");
            setOurSelectionProducts(res.data || []);
        } catch (err) {
            console.error("Error fetching our selection:", err);
            setOurSelectionProducts([]);
        } finally {
            setIsLoadingOurSelection(false);
        }
    };

    const fetchRecommendations = async (auth) => {
        try {
            setIsLoadingRecommendations(true);
            const prefs = JSON.parse(localStorage.getItem("preferences")) || {};

            if (!auth?.user && (!prefs.categories?.length && !prefs.ingredients?.length)) {
                return;
            }

            const params = auth?.user
                ? {}
                : {
                    categories: prefs.categories,
                    ingredients: prefs.ingredients,
                    budget: prefs.budget,
                };

            const res = await axios.get("/get-recommendations", { params });
            setRecommendedProducts(res.data || []);
        } catch (err) {
            console.error("Error fetching recommendations:", err);
        } finally {
            setIsLoadingRecommendations(false);
        }
    };

    const redirectIfNoPreferences = (auth) => {
        const prefs = localStorage.getItem("preferences");
        if (!auth?.user && !prefs) {
            router.visit("/");
        }
    };

    useEffect(() => {
        const init = async () => {
            redirectIfNoPreferences(auth);
            await fetchRecommendations(auth);
            await syncPreferencesToServer(auth, isPreferenceStored);
            await fetchCategories();
            await fetchOurSelection();
        };

        init();
    }, [auth?.user, isPreferenceStored]);


    return (
        <HomeLayout>
            <ExperienceSection />
            <EducationSection />
            <SkillsSection />
            <ProjectsSection />
        </HomeLayout>
    );
}
