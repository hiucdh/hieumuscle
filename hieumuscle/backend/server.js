import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import foodRoutes from './routes/foods.js';
import nutritionRoutes from './routes/nutrition.js';
import progressRoutes from './routes/progress.js';
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI


app.use(cors())
app.use(express.json())
app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection failed:', err))


app.get('/', (req, res) => {
    res.send('API is running...')
})


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})
