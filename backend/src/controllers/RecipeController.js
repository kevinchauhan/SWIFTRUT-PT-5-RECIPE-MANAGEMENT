import Recipe from '../models/Recipe.js';

class RecipeController {
    // Get all recipes
    static async getAllRecipes(req, res) {
        try {
            const { search } = req.query;

            // Build the query object
            const query = {};

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }, // Case-insensitive title search
                    { ingredients: { $regex: search, $options: 'i' } }, // Case-insensitive ingredient search
                    { instructions: { $regex: search, $options: 'i' } }, // Case-insensitive instructions search
                    { cuisineType: { $regex: search, $options: 'i' } }, // Case-insensitive cuisineType search
                    { notes: { $regex: search, $options: 'i' } } // Case-insensitive notes search
                ];
            }

            // Fetch recipes with search filters and sorting
            const recipes = await Recipe.find(query).sort({ createdAt: -1 });

            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a specific recipe by ID
    static async getRecipeById(req, res) {
        try {
            const recipe = await Recipe.findById(req.params.id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            res.json(recipe);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new recipe
    static async createRecipe(req, res) {
        const { title, ingredients, instructions, author, cuisineType, prepTime, coverImage } = req.body;
        const newRecipe = new Recipe({
            title,
            ingredients,
            instructions,
            author,
            cuisineType,
            prepTime,
            coverImage,
            userId: req.user.id,
        });
        try {
            await newRecipe.save();
            res.status(201).json(newRecipe);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update an existing recipe by ID
    static async updateRecipe(req, res) {
        const { title, ingredients, instructions, cuisineType, prepTime, coverImage } = req.body;
        try {
            const recipe = await Recipe.findById(req.params.id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            // Check if the logged-in user is the author of the recipe
            if (recipe.userId?.toString() !== req.user?.id.toString()) {
                return res.status(403).json({ message: 'You are not authorized to update this recipe' });
            }

            recipe.title = title || recipe.title;
            recipe.ingredients = ingredients || recipe.ingredients;
            recipe.instructions = instructions || recipe.instructions;
            recipe.cuisineType = cuisineType || recipe.cuisineType;
            recipe.prepTime = prepTime || recipe.prepTime;
            recipe.coverImage = coverImage || recipe.coverImage;

            await recipe.save();
            res.json(recipe);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a recipe by ID
    static async deleteRecipe(req, res) {
        try {
            const recipe = await Recipe.findById(req.params.id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            // Check if the logged-in user is the author of the recipe
            if (recipe.author.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
            }

            await Recipe.findByIdAndDelete(req.params.id);
            res.json({ message: 'Recipe deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RecipeController;
