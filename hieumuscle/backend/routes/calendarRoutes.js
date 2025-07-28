import express from 'express';
import WorkoutLog from '../models/WorkoutLog.js';

const router = express.Router();

// Lấy toàn bộ lịch tập theo userId
router.get('/:userId', async (req, res) => {
    try {
        const logs = await WorkoutLog.find({ userId: req.params.userId });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/', async (req, res) => {
    const { userId, date, exercises } = req.body;
    try {
        const log = new WorkoutLog({ userId, date, exercises });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: 'Tạo log thất bại' });
    }
});

export default router;
