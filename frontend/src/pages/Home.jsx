import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        cuisineType: '',
        prepTime: ''
    });

    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Fetch recipes based on search query and filters
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const queryParams = new URLSearchParams();

                if (searchQuery) queryParams.append('search', searchQuery);
                if (filters.cuisineType) queryParams.append('cuisineType', filters.cuisineType);
                if (filters.prepTime) queryParams.append('prepTime', filters.prepTime);

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/recipe?${queryParams.toString()}`
                );
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, [searchQuery, filters]);

    // Handle "Create Recipe" button click
    const handleCreateRecipeClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/recipe-form');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">All Recipes</h2>

            {/* Search and Filter Section */}
            <div className="mb-4 flex justify-between items-center gap-4 flex-wrap">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
                    />
                    {/* <select
                        value={filters.cuisineType}
                        onChange={(e) => setFilters({ ...filters, cuisineType: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Cuisines</option>
                        <option value="Italian">Italian</option>
                        <option value="Indian">Indian</option>
                        <option value="Mexican">Mexican</option>
                    </select>
                    <select
                        value={filters.prepTime}
                        onChange={(e) => setFilters({ ...filters, prepTime: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Prep Times</option>
                        <option value="30">Up to 30 minutes</option>
                        <option value="60">Up to 60 minutes</option>
                        <option value="120">Up to 120 minutes</option>
                    </select> */}
                </div>

                <button
                    onClick={handleCreateRecipeClick}
                    className="px-6 py-2 bg-green-600 text-white rounded-md w-full sm:w-auto"
                >
                    Create Recipe
                </button>
            </div>

            {/* Recipe List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe._id} className="p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-lg">
                            <img
                                src={recipe.coverImage}
                                alt={recipe.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-semibold">{recipe.title}</h3>
                            <p className="text-sm text-gray-500">Cuisine: {recipe.cuisineType}</p>
                            <p className="text-sm text-gray-500">Prep Time: {recipe.prepTime} minutes</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Ingredients: {recipe.ingredients.slice(0, 50)}...
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <Link to={`/recipe/${recipe._id}`} className="text-indigo-600 hover:underline">View Recipe</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
