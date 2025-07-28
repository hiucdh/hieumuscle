import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    foods: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
            quantity: { type: Number, default: 1 },
        }
    ],
}, { timestamps: true });

export default mongoose.model('MealLog', mealLogSchema);
