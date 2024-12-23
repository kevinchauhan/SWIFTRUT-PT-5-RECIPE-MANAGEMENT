import Recipe from '../models/Recipe.js';

class RecipeController {
    // Get all recipes
    static async getAllRecipes(req, res) {
        try {
            const recipes = await Recipe.find().sort({ createdAt: -1 });
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
        const { title, ingredients, instructions, author, cuisineType, prepTime, coverImage } = req.body;
        try {
            const recipe = await Recipe.findById(req.params.id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            recipe.title = title || recipe.title;
            recipe.ingredients = ingredients || recipe.ingredients;
            recipe.instructions = instructions || recipe.instructions;
            recipe.author = author || recipe.author;
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
            const recipe = await Recipe.findByIdAndDelete(req.params.id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            res.json({ message: 'Recipe deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RecipeController;
