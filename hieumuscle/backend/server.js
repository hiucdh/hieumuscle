import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api', authRoutes);



// MongoDB connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection failed:', err))

// Sample route
app.get('/', (req, res) => {
    res.send('API is running...')
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})
