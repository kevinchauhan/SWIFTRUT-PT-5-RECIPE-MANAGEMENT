import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const RecipeDetailsPage = () => {
    const { id } = useParams(); // Get recipe ID from URL
    const [recipe, setRecipe] = useState(null); // Recipe state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Zustand store
    const navigate = useNavigate();

    // Fetch recipe details based on the ID
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipe/${id}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching recipe details:', err);
                setError('Failed to fetch recipe details.');
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    // Handle recipe deletion
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
        if (confirmDelete) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipe/${id}`);
                navigate('/'); // Redirect to the home page
            } catch (err) {
                console.error('Error deleting recipe:', err);
                alert('Failed to delete the recipe.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Link to="/" className="text-indigo-600 hover:underline mb-4 inline-block">← Back to All Recipes</Link>

            <div className="border border-gray-300 rounded-md shadow-sm p-6">
                <img
                    src={recipe.coverImage}
                    alt={recipe.title}
                    className="w-full h-64 object-cover rounded-md mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-sm text-gray-500 mb-2">Cuisine: {recipe.cuisineType}</p>
                <p className="text-sm text-gray-500 mb-4">Prep Time: {recipe.prepTime} minutes</p>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Ingredients:</h3>
                    <ul className="list-disc ml-5">
                        {recipe.ingredients?.map((ingredient, index) => (
                            <li key={index} className="text-gray-700">{ingredient}</li>
                        ))}
                    </ul>
                </div>

                {/* <div className="mb-4">
                    <h3 className="text-lg font-semibold">Steps:</h3>
                    <ol className="list-decimal ml-5">
                        {recipe.steps?.map((step, index) => (
                            <li key={index} className="text-gray-700 mb-2">{step}</li>
                        ))}
                    </ol>
                </div> */}

                {recipe.notes && (
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Notes:</h3>
                        <p className="text-gray-700">{recipe.notes}</p>
                    </div>
                )}

                {/* Conditionally show edit/delete options based on authentication */}
                {isAuthenticated && (
                    <div className="flex justify-end space-x-4 mt-6">
                        <Link
                            to={`/recipe-form/${id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Edit Recipe
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete Recipe
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDetailsPage;
