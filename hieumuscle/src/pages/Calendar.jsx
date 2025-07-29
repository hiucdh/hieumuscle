// Calendar.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Calendar.css'
import { FaEdit, FaTrash } from 'react-icons/fa';

const WorkoutCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workoutLogs, setWorkoutLogs] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [newWorkout, setNewWorkout] = useState('');
    const [editIdx, setEditIdx] = useState(null);
    const [editValue, setEditValue] = useState('');
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

    // Xoá bài tập khỏi ngày
    const handleDeleteWorkout = async (idx) => {
        const date = formatDate(selectedDate);
        const newList = [...(workoutLogs[date] || [])];
        newList.splice(idx, 1);
        try {
            await axios.put(`http://localhost:8080/api/calendar`, {
                userId: user.userId,
                date,
                exercises: newList
            });
            setWorkoutLogs((prev) => ({ ...prev, [date]: newList }));
        } catch (err) {
            console.error('❌ Lỗi xoá bài tập:', err);
        }
    };

    // Sửa bài tập
    const handleEditWorkout = (idx, value) => {
        setEditIdx(idx);
        setEditValue(value);
    };
    const handleSaveEdit = async (idx) => {
        const date = formatDate(selectedDate);
        const newList = [...(workoutLogs[date] || [])];
        newList[idx] = editValue;
        try {
            await axios.put(`http://localhost:8080/api/calendar`, {
                userId: user.userId,
                date,
                exercises: newList
            });
            setWorkoutLogs((prev) => ({ ...prev, [date]: newList }));
            setEditIdx(null);
            setEditValue('');
        } catch (err) {
            console.error('❌ Lỗi sửa bài tập:', err);
        }
    };
    const handleCancelEdit = () => {
        setEditIdx(null);
        setEditValue('');
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 py-10 px-4 flex justify-center">
            <div className="max-w-3xl w-full bg-white/90 p-8 rounded-3xl shadow-2xl border border-blue-100">
                <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-10 tracking-wide drop-shadow-lg uppercase">
                    Workout Calendar
                </h2>

                {userInfo && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/95 rounded-2xl shadow border border-blue-100 px-8 py-5 flex flex-col items-center gap-2 w-full max-w-md">
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
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow mb-8 border border-blue-100">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileContent={tileContent}
                        className="mx-auto border-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* Form quản lý bài tập cho ngày đã chọn */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2 text-center">
                        Quản lý bài tập cho ngày <span className="text-blue-700">{selectedDate.toLocaleDateString()}</span>
                    </h3>
                    <div className="flex flex-col items-center">
                        {(workoutLogs[formatDate(selectedDate)] && workoutLogs[formatDate(selectedDate)].length > 0) ? (
                            <ul className="w-full max-w-md bg-white rounded-xl shadow border border-blue-100 p-3 mb-4">
                                {workoutLogs[formatDate(selectedDate)].map((item, idx) => (
                                    <li key={idx} className="py-2 flex items-center justify-between gap-2 border-b last:border-b-0">
                                        {editIdx === idx ? (
                                            <>
                                                <input
                                                    className="border border-blue-300 px-2 py-1 rounded w-2/3 focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                                <button onClick={() => handleSaveEdit(idx)} className="text-green-600 px-1 text-sm" title="Lưu"><FaEdit /></button>
                                                <button onClick={handleCancelEdit} className="text-gray-400 px-1 text-sm" title="Huỷ">✕</button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-blue-900 font-medium text-sm">{item}</span>
                                                <div className="flex gap-1">
                                                    <button onClick={() => handleEditWorkout(idx, item)} className="text-blue-500 hover:text-blue-700 p-1 rounded transition" title="Sửa"><FaEdit size={16} /></button>
                                                    <button onClick={() => handleDeleteWorkout(idx)} className="text-red-400 hover:text-red-600 p-1 rounded transition" title="Xoá"><FaTrash size={16} /></button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-400 italic text-center py-4">Chưa có bài tập cho ngày này.</div>
                        )}
                        {/* Input thêm bài tập mới */}
                        <div className="flex gap-2 w-full max-w-md mt-2 bg-white rounded-2xl shadow border border-blue-100 p-4">
                            <input
                                type="text"
                                placeholder="Nhập bài tập..."
                                className="border border-blue-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 bg-white"
                                value={newWorkout}
                                onChange={(e) => setNewWorkout(e.target.value)}
                            />
                            <button
                                onClick={handleAddWorkout}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

                {getSuggestedPlan() && (
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2 text-center">
                            Gợi ý lịch tập mẫu theo BMI
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border border-blue-200 rounded-xl shadow bg-white">
                                <thead>
                                    <tr className="bg-blue-50 text-blue-900">
                                        <th className="px-4 py-2 border-b font-bold">Ngày</th>
                                        <th className="px-4 py-2 border-b font-bold">Nhóm cơ</th>
                                        <th className="px-4 py-2 border-b font-bold">Bài tập chính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSuggestedPlan().map((item, idx) => (
                                        <tr key={idx} className="border-t hover:bg-blue-50 transition">
                                            <td className="px-4 py-2 border-b font-bold text-blue-900">{item.day}</td>
                                            <td className="px-4 py-2 border-b font-semibold text-blue-800">{item.group}</td>
                                            <td className="px-4 py-2 border-b text-blue-900">{item.exercises.join(', ')}</td>
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
