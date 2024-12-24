import express from 'express';
import RecipeController from '../controllers/RecipeController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', RecipeController.getAllRecipes);
router.get('/:id', RecipeController.getRecipeById);
router.post('/', authenticate, RecipeController.createRecipe);
router.put('/:id', authenticate, RecipeController.updateRecipe);
router.delete('/:id', authenticate, RecipeController.deleteRecipe);

export default router;
