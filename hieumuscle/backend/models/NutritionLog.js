import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: String, required: true },
    foods: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        quantity: Number
    }]
}, { timestamps: true });

export default mongoose.model('NutritionLog', nutritionLogSchema);
