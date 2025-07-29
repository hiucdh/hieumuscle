import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng.' });


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Tài khoản không tồn tại.' });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu.' });

        res.status(200).json({ message: 'Đăng nhập thành công!', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
