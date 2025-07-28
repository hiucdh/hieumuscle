import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    exercises: [String], // ['Chest', 'Legs'] ...
});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;
