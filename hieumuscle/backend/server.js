import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Server listen
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
