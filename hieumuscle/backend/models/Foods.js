// models/Foods.js
import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameUnsigned: { type: String },
    code: { type: String, required: true },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    servingSize: String
}, { timestamps: true });

export default mongoose.model('Food', foodSchema);
