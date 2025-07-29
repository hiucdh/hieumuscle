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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
            <div className="max-w-4xl mx-auto rounded-3xl shadow-2xl bg-white/90 border border-blue-100 p-8">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-800 tracking-wide drop-shadow-lg uppercase">
                    Theo dõi tiến độ
                </h2>

                <div className="bg-white p-6 rounded-2xl shadow mb-10 border border-blue-100">
                    <Line data={chartData} options={{
                        plugins: {
                            legend: {
                                labels: { color: '#1e293b', font: { size: 16, weight: 'bold' } }
                            }
                        },
                        scales: {
                            x: { ticks: { color: '#64748b', font: { size: 14 } } },
                            y: { ticks: { color: '#64748b', font: { size: 14 } } }
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                    }} height={350} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-blue-200 rounded-xl shadow bg-white">
                        <thead className="bg-blue-50 text-blue-900">
                            <tr>
                                <th className="p-3 border-b font-bold">Ngày</th>
                                <th className="p-3 border-b font-bold">Cân nặng (kg)</th>
                                <th className="p-3 border-b font-bold">Calories</th>
                                <th className="p-3 border-b font-bold">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progressData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">Chưa có dữ liệu tiến độ.</td>
                                </tr>
                            ) : progressData.map((p, idx) => (
                                <tr key={idx} className="border-t hover:bg-blue-50 transition">
                                    <td className="p-3 border-b font-semibold text-blue-900">{p.date}</td>
                                    <td className="p-3 border-b font-semibold text-blue-700">{p.weight}</td>
                                    <td className="p-3 border-b font-semibold text-orange-600">{p.calories}</td>
                                    <td className="p-3 border-b text-gray-700">{p.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
