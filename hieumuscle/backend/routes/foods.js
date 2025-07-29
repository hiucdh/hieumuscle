import express from 'express';
import Food from '../models/Foods.js';

const router = express.Router();


router.get('/search', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Thiếu tên món ăn để tìm kiếm' });
    }

    try {

        const regex = new RegExp(name, 'i');
        const results = await Food.find({ name: regex });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi tìm kiếm' });
    }
});

export default router;
