import express from 'express';
import Food from '../models/Foods.js'; // hoặc '../models/Foods.js' nếu bạn giữ tên file đó

const router = express.Router();

// ✅ API tìm kiếm theo tên (có dấu/không dấu vẫn khớp được)
router.get('/search', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Thiếu tên món ăn để tìm kiếm' });
    }

    try {
        // Regex tìm không phân biệt hoa thường & hỗ trợ tên có dấu
        const regex = new RegExp(name, 'i');
        const results = await Food.find({ name: regex });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi tìm kiếm' });
    }
});

export default router;
