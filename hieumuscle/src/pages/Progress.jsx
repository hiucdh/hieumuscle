import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ProgressPage = () => {
    const [progressData, setProgressData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weight, setWeight] = useState('');
    const [note, setNote] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const formatDate = (date) => date.toISOString().split('T')[0];

    const fetchProgress = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/progress/${user.userId}`);
            setProgressData(res.data);
        } catch (err) {
            console.error('Lỗi khi lấy tiến độ:', err);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8080/api/progress', {
                userId: user.userId,
                date: formatDate(selectedDate),
                weight: Number(weight),
                note
            });
            setWeight('');
            setNote('');
            fetchProgress();
        } catch (err) {
            console.error('Lỗi khi thêm tiến độ:', err);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const chartData = {
        labels: progressData.map(p => p.date),
        datasets: [
            {
                label: 'Cân nặng (kg)',
                data: progressData.map(p => p.weight),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4
            },
            {
                label: 'Calories',
                data: progressData.map(p => p.calories),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Theo dõi tiến độ</h2>

            {/* Đã xoá Calendar và form nhập cân nặng, ghi chú */}

            <div className="bg-white p-4 rounded shadow mb-6">
                <Line data={chartData} />
            </div>

            <table className="w-full text-left border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Ngày</th>
                        <th className="p-2 border">Cân nặng (kg)</th>
                        <th className="p-2 border">Calories</th>
                        <th className="p-2 border">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {progressData.map((p, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="p-2 border">{p.date}</td>
                            <td className="p-2 border">{p.weight}</td>
                            <td className="p-2 border">{p.calories}</td>
                            <td className="p-2 border text-gray-700">{p.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProgressPage;
