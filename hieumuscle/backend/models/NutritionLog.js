import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: String, required: true }, // YYYY-MM-DD
    foods: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        quantity: Number // Số lượng phần ăn (vd: 1.5 * 100g)
    }]
}, { timestamps: true });

export default mongoose.model('NutritionLog', nutritionLogSchema);
