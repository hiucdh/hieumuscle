// Calendar.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const WorkoutCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workoutLogs, setWorkoutLogs] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

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

    const getBMI = () => {
        if (!userInfo?.height || !userInfo?.weight) return null;
        const heightM = userInfo.height / 100;
        return (userInfo.weight / (heightM * heightM)).toFixed(1);
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

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
            <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Workout Calendar
                </h2>

                {userInfo && (
                    <div className="text-center mb-4">
                        <p>Email: <span className="font-medium">{userInfo.email}</span></p>
                        <p>BMI: <span className="font-semibold">{getBMI()}</span></p>
                        <p>Gợi ý lịch tập: <span className="text-blue-600">{getWorkoutSuggestion().join(', ')}</span></p>
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
            </div>
        </div>
    );
};

export default WorkoutCalendar;
