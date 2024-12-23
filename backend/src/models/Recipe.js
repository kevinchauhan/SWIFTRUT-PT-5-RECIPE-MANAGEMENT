import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    author: { type: String, required: true },
    cuisineType: { type: [String] },
    prepTime: { type: Number, required: true },
    coverImage: { type: String },
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);
