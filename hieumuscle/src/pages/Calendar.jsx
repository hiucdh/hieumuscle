// Calendar.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Calendar.css'

const WorkoutCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workoutLogs, setWorkoutLogs] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [newWorkout, setNewWorkout] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const getBMI = () => {
        if (!userInfo?.height || !userInfo?.weight) return null;
        const heightM = userInfo.height / 100;
        return (userInfo.weight / (heightM * heightM)).toFixed(1);
    };

    const getSuggestedPlan = () => {
        const bmi = getBMI();

        if (!bmi) return null;

        if (bmi < 18.5) {
            return [
                { day: 'T2', group: 'Ngực - Tay sau', exercises: ['Bench press', 'Dips', 'Triceps extension'] },
                { day: 'T3', group: 'Lưng - Tay trước', exercises: ['Pull-up', 'Barbell row', 'Biceps curl'] },
                { day: 'T4', group: 'Chân - Mông', exercises: ['Squat', 'Deadlift', 'Glute bridge'] },
                { day: 'T5', group: 'Vai - Bụng', exercises: ['Overhead press', 'Lateral raise', 'Plank'] },
                { day: 'T6', group: 'Fullbody nhẹ', exercises: ['Bodyweight Circuit', 'Burpee', 'Core'] },
                { day: 'T7', group: 'Lưng - Tay trước', exercises: ['Lat pulldown', 'One-arm row', 'Hammer curl'] },
            ];
        }

        if (bmi >= 18.5 && bmi < 25) {
            return [
                { day: 'T2', group: 'Ngực - Tay', exercises: ['Push-up', 'Incline bench', 'Dumbbell curl'] },
                { day: 'T3', group: 'Lưng - Vai', exercises: ['Pull-up', 'Lateral raise', 'Shrugs'] },
                { day: 'T4', group: 'Cardio - Core', exercises: ['HIIT', 'Mountain climber', 'Leg raise'] },
                { day: 'T5', group: 'Chân - Mông', exercises: ['Squat', 'Bulgarian lunge', 'Hip thrust'] },
                { day: 'T6', group: 'Fullbody', exercises: ['Circuit training', 'Jump squat', 'Plank'] },
            ];
        }

        return [
            { day: 'T2', group: 'Cardio + Ngực', exercises: ['HIIT', 'Chest press'] },
            { day: 'T3', group: 'Lưng + Tay', exercises: ['Rowing', 'Cable pull', 'Curl'] },
            { day: 'T4', group: 'Cardio + Core', exercises: ['Treadmill', 'Crunches', 'Plank'] },
            { day: 'T5', group: 'Chân - Mông', exercises: ['Walking lunge', 'Kettlebell swing'] },
            { day: 'T6', group: 'Vai - Toàn thân', exercises: ['Dumbbell press', 'Jump rope'] },
            { day: 'T7', group: 'Cardio dài', exercises: ['45 phút đi bộ nhanh', 'Đạp xe'] },
        ];
    };


    useEffect(() => {
        if (user?.userId) {
            fetchUserInfo();
            fetchWorkoutLogs();
        }
    }, [user]);

    const fetchUserInfo = async () => {
        const res = await axios.get(`http://localhost:8080/api/profile/${user.userId}`);
        setUserInfo(res.data);
    };

    const fetchWorkoutLogs = async () => {
        const res = await axios.get(`http://localhost:8080/api/calendar/${user.userId}`);
        const logMap = {};
        res.data.forEach(log => {
            logMap[log.date] = log.exercises;
        });
        setWorkoutLogs(logMap);
    };



    const getWorkoutSuggestion = () => {
        const bmi = getBMI();
        if (!bmi) return [];
        if (bmi < 18.5) return ['Bulking', 'Strength Training'];
        if (bmi >= 18.5 && bmi < 25) return ['Maintenance', 'Split Workout'];
        return ['Fat Loss', 'HIIT'];
    };

    const formatDate = (date) => date.toISOString().split('T')[0];

    const tileContent = ({ date, view }) => {
        const key = formatDate(date);
        if (view === 'month' && workoutLogs[key]) {
            return (
                <div className="mt-1 text-xs text-green-600 font-semibold">
                    {workoutLogs[key].map((item, idx) => (
                        <div key={idx}>{item}</div>
                    ))}
                </div>
            );
        }
        return null;
    };


    const handleAddWorkout = async () => {
        if (!newWorkout.trim()) return;

        const date = formatDate(selectedDate);

        try {
            await axios.post(`http://localhost:8080/api/calendar`, {
                userId: user.userId,
                date,
                exercises: [newWorkout], // ✅ key đúng & là mảng
            });

            // Cập nhật local ngay sau khi thêm
            setWorkoutLogs((prev) => ({
                ...prev,
                [date]: prev[date] ? [...prev[date], newWorkout] : [newWorkout]
            }));

            setNewWorkout('');
        } catch (err) {
            console.error('❌ Lỗi thêm bài tập:', err);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
            <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Workout Calendar
                </h2>

                {userInfo && (
                    <div className="text-center mb-4 space-y-1">
                        <p className="text-gray-800 font-medium">
                            Email: <span className="font-semibold">{userInfo.email}</span>
                        </p>
                        <p className="text-gray-800 font-medium">
                            BMI: <span className="font-semibold">{getBMI()}</span>
                        </p>
                        <p className="text-gray-800 font-medium">
                            Gợi ý lịch tập: <span className="text-blue-700 font-semibold">{getWorkoutSuggestion().join(', ')}</span>
                        </p>
                    </div>

                )}

                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    className="mx-auto border-none"
                />

                <div className="mt-6 text-center">
                    <p className="text-gray-700">
                        Selected Date: <span className="font-semibold">{selectedDate.toDateString()}</span>
                    </p>
                </div>
                <div className="mt-4 flex flex-col items-center space-y-2">
                    <input
                        type="text"
                        placeholder="Nhập bài tập..."
                        className="border border-gray-300 rounded px-3 py-1 w-full max-w-xs"
                        value={newWorkout}
                        onChange={(e) => setNewWorkout(e.target.value)}
                    />
                    <button
                        onClick={handleAddWorkout}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Thêm bài tập
                    </button>
                </div>
                {getSuggestedPlan() && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                            Gợi ý lịch tập mẫu theo BMI
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="bmi-plan-table min-w-full text-left">

                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-4 py-2 border">Ngày</th>
                                        <th className="px-4 py-2 border">Nhóm cơ</th>
                                        <th className="px-4 py-2 border">Bài tập chính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSuggestedPlan().map((item, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-2 border">{item.day}</td>
                                            <td className="px-4 py-2 border">{item.group}</td>
                                            <td className="px-4 py-2 border">{item.exercises.join(', ')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default WorkoutCalendar;
