import express from 'express';
import NutritionLog from '../models/NutritionLog.js';
import Food from '../models/Foods.js';

const router = express.Router();

// ✅ Lấy log theo ngày và user
router.get('/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;
    try {
        const log = await NutritionLog.findOne({ userId, date }).populate('foods.foodId');
        res.json(log || {});
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Thêm món ăn vào log
router.post('/', async (req, res) => {
    const { userId, date, foodId, quantity } = req.body;

    try {
        let log = await NutritionLog.findOne({ userId, date });

        if (!log) {
            log = new NutritionLog({ userId, date, foods: [{ foodId, quantity }] });
        } else {
            log.foods.push({ foodId, quantity });
        }

        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: 'Thêm log thất bại' });
    }
});

export default router;
