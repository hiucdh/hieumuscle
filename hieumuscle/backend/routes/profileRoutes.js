import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Lấy thông tin user theo ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cập nhật thông tin profile (chiều cao, cân nặng, username nếu cần)
router.put('/:id', async (req, res) => {
    const { username, height, weight } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

        if (username) user.username = username;
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;

        await user.save();

        res.status(200).json({ message: 'Cập nhật thành công!', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
