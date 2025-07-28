// models/Progress.js
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // yyyy-mm-dd
    weight: Number,
    note: String,
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
