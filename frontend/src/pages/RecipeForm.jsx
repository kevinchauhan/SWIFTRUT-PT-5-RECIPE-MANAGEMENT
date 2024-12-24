import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeFormPage = () => {
    const { id } = useParams(); // If there's an id, it's an edit
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        author: '',
        cuisineType: '',
        prepTime: '',
        coverImage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch recipe data for editing (if id is provided)
    useEffect(() => {
        if (id) {
            const fetchRecipe = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipe/${id}`);
                    setRecipe(response.data);
                } catch (error) {
                    console.error('Error fetching recipe:', error);
                    setError('Error fetching recipe');
                }
            };
            fetchRecipe();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (id) {
                // Editing an existing recipe
                await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipe/${id}`, recipe);
                navigate(`/recipe/${id}`); // Redirect to the recipe detail page after successful edit
            } else {
                // Creating a new recipe
                await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/recipe`, recipe);
                navigate('/'); // Redirect to the home page after successful creation
            }
        } catch (error) {
            console.error('Error submitting recipe:', error);
            setError('Failed to save the recipe');
        }
        setIsLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Recipe' : 'Add Recipe'}</h2>

            {error && <p className="text-red-600">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients</label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        value={recipe.ingredients}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        value={recipe.instructions}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={recipe.author}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                    <input
                        type="text"
                        id="cuisineType"
                        name="cuisineType"
                        value={recipe.cuisineType}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
                    <input
                        type="number"
                        id="prepTime"
                        name="prepTime"
                        value={recipe.prepTime}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                    <input
                        type="text"
                        id="coverImage"
                        name="coverImage"
                        value={recipe.coverImage}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : id ? 'Update Recipe' : 'Add Recipe'}
                </button>
            </form>
        </div>
    );
};

export default RecipeFormPage;
