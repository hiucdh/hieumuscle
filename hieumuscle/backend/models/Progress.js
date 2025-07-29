import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    weight: Number,
    note: String,
    calories: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
