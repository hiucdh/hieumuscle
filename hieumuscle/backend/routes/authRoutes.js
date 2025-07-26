import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kiểm tra người dùng đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng.' });

        // Mã hoá mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại.' });

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu.' });

        res.status(200).json({ message: 'Đăng nhập thành công!', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
