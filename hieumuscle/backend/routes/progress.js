// routes/progress.js
import express from 'express';
import Progress from '../models/Progress.js';
import MealLog from '../models/MealLog.js'; // để tính tổng calories
import Food from '../models/Foods.js';

const router = express.Router();

// POST: Ghi nhật ký tiến độ (cân nặng + ghi chú)
router.post('/', async (req, res) => {
    const { userId, date, weight, note } = req.body;

    if (!userId || !date || !weight) {
        return res.status(400).json({ error: 'Thiếu userId, date hoặc weight' });
    }

    try {
        // Tính tổng calories từ mealLog
        const mealLog = await MealLog.findOne({ userId, date }).populate('foods.foodId');
        let calories = 0;


        if (mealLog) {
            mealLog.foods.forEach(({ foodId, quantity }) => {
                if (foodId && foodId.calories) {
                    calories += foodId.calories * quantity;
                }
            });
        }

        const newEntry = new Progress({
            userId,
            date,
            weight,
            calories,
            note,
        });

        await newEntry.save();
        res.json({ message: 'Tiến độ đã được ghi lại!', data: newEntry });
    } catch (err) {
        console.error('❌ Lỗi ghi lại tiến độ:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



// GET: Lấy toàn bộ tiến độ + tổng calories từ mealLog
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const progresses = await Progress.find({ userId }).sort({ date: 1 });

        // lấy calories cho mỗi ngày từ meal log
        const result = [];

        for (let prog of progresses) {
            const meal = await MealLog.findOne({ userId, date: prog.date }).populate('foods.foodId');
            let totalCalories = 0;

            if (meal && meal.foods?.length) {
                for (let { foodId, quantity } of meal.foods) {
                    console.log(`📌 Ngày ${prog.date} - Tổng calo: ${totalCalories}`);
                    totalCalories += (foodId.calories || 0) * quantity;
                }
            }

            result.push({
                date: prog.date,
                weight: prog.weight,
                note: prog.note,
                calories: totalCalories,
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy tiến độ' });
    }
});

export default router;
