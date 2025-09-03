import { Link } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

const FoodList = ({isLoggedIn }) => {
    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recommendedFoods, setRecommendedFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil preferensi pengguna dari localStorage
    useEffect(() => {
        const storedPreferences = JSON.parse(localStorage.getItem("preferences")) || { categories: [], ingredients: [] };
        setSelectedCategories(storedPreferences.categories);
        setSelectedIngredients(storedPreferences.ingredients);

        // Filter makanan berdasarkan sessionStorage untuk menyimpan yang telah dikunjungi
        const excludedFoods = JSON.parse(sessionStorage.getItem("excludedFoods")) || [];
        const availableFoods = foods.filter((food) => !excludedFoods.includes(food.id));

        setRecommendedFoods(availableFoods.length > 0 ? availableFoods : foods);
    }, [foods]);

    // Fetch makanan berdasarkan pencarian dengan debounce
    useEffect(() => {
        if (!search.trim()) {
            setFilteredFoods([]);
            return;
        }

        const fetchFoods = async () => {
            setLoading(true);
            setError(null);
            try {
                const storedPreferences = JSON.parse(localStorage.getItem("preferences")) || {};
                const response = await axios.get("/get-foods", {
                    params: {
                        search,
                        categories: storedPreferences.categories || [],
                        ingredients: storedPreferences.ingredients || [],
                    },
                });
                setFilteredFoods(response.data);
            } catch (err) {
                setError("Error fetching foods. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(fetchFoods, 800);
        return () => clearTimeout(debounceFetch);
    }, [search]);

    // Gunakan hasil pencarian atau rekomendasi
    const displayedFoods = useMemo(() => {
        return search.trim() ? filteredFoods : recommendedFoods;
    }, [search, filteredFoods, recommendedFoods]);

    return (
        <div className="mx-auto max-w-4xl p-5">
            <input
                type="text"
                placeholder="Search for food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-blue-400"
            />

            {loading && <p className="mt-3 text-center text-gray-500">Loading...</p>}
            {error && <p className="mt-3 text-center text-red-500">{error}</p>}

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                {displayedFoods.length > 0 ? (
                    displayedFoods.map((food) => (
                        <Link
                            href={route("foods.show", { id: food.id })}
                            key={food.id}
                            className="block"
                        >
                            <div className="flex overflow-hidden rounded-lg bg-white shadow-md transition hover:bg-gray-100">
                                <img
                                    src={`/images/${food.image}`}
                                    alt={food.name}
                                    className="h-32 w-32 object-cover"
                                />
                                <div className="flex-1 p-4">
                                    <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                                        {food.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {food.description ? food.description.substring(0, 50) : ''}...
                                    </p>
                                    <p className="mt-1 font-bold text-green-600">
                                        Rp {food.price}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    !loading && <p className="col-span-2 text-center text-gray-500">No food found.</p>
                )}
            </div>
        </div>
    );
};

export default FoodList;