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

    // Fetch all recipes from the backend
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipe`);
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, []);

    // Handle deletion of a recipe
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
        if (confirmDelete) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipes/${id}`);
                setRecipes(recipes.filter((recipe) => recipe._id !== id));
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    // Filter the recipes based on search and filters
    const filteredRecipes = recipes.filter((recipe) => {
        const matchSearchQuery = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCuisineType = filters.cuisineType ? recipe.cuisineType === filters.cuisineType : true;
        const matchPrepTime = filters.prepTime ? recipe.prepTime <= filters.prepTime : true;

        return matchSearchQuery && matchCuisineType && matchPrepTime;
    });

    // Handle "Create Recipe" button click
    const handleCreateRecipeClick = () => {
        if (!isAuthenticated) {
            // If not logged in, redirect to the login page
            navigate('/login');
        } else {
            // If logged in, navigate to the create recipe form page
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
                    <select
                        value={filters.prepTime}
                        onChange={(e) => setFilters({ ...filters, prepTime: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Prep Times</option>
                        <option value="30">Up to 30 minutes</option>
                        <option value="60">Up to 60 minutes</option>
                        <option value="120">Up to 120 minutes</option>
                    </select>
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
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <div key={recipe._id} className="p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-lg">
                            <img
                                src={recipe.coverImage?.IMAGE || 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg'}
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
                                {isAuthenticated && (
                                    <div className="flex space-x-4">
                                        <Link to={`/recipe-form/${recipe._id}`} className="text-blue-600 hover:underline">Edit</Link>
                                        <button
                                            onClick={() => handleDelete(recipe._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
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
