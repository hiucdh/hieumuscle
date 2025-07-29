import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const MealLog = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [mealLog, setMealLog] = useState([]);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [weight, setWeight] = useState('');
    const [note, setNote] = useState('');
    const [message, setMessage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const formatDate = (date) => date.toISOString().split('T')[0];

    const fetchMealLog = async () => {
        const dateStr = formatDate(selectedDate);
        try {
            const res = await axios.get(`http://localhost:8080/api/nutrition/${user.userId}/${dateStr}`);
            setMealLog(res.data?.foods || []);
        } catch (err) {
            console.error('Failed to fetch meal log', err);
            setMealLog([]);
        }
    };

    const searchFoods = async () => {
        if (!searchTerm.trim()) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/foods/search?name=${searchTerm}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error('Search failed:', err);
        }
    };

    const addFoodToLog = async (foodId) => {
        const dateStr = formatDate(selectedDate);
        try {
            await axios.post('http://localhost:8080/api/nutrition', {
                userId: user.userId,
                date: dateStr,
                foodId,
                quantity,
            });
            setSearchTerm('');
            setQuantity(1);
            setSearchResults([]);
            fetchMealLog();
        } catch (err) {
            console.error('Failed to add food', err);
        }
    };

    const handleSubmitProgress = async () => {
        if (!weight || Number(weight) <= 0) {
            setMessage('Vui lòng nhập cân nặng hợp lệ!');
            return;
        }
        try {
            await axios.post('http://localhost:8080/api/progress', {
                userId: user.userId,
                date: formatDate(selectedDate),
                weight: Number(weight),
                note,
                calories: totals.calories,
            });
            setMessage('Đã chốt calo và ghi nhận tiến độ!');
            setWeight('');
            setNote('');
        } catch (err) {
            setMessage('Có lỗi khi chốt calo!');
        }
    };

    useEffect(() => {
        fetchMealLog();
    }, [selectedDate]);

    useEffect(() => {
        let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        mealLog.forEach(({ foodId, quantity }) => {
            if (foodId) {
                totals.calories += foodId.calories * quantity;
                totals.protein += foodId.protein * quantity;
                totals.carbs += foodId.carbs * quantity;
                totals.fat += foodId.fat * quantity;
            }
        });
        setTotals(totals);
    }, [mealLog]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-100 py-10">
            <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl bg-white/90 border border-green-100 p-8">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-green-700 tracking-wide drop-shadow-lg uppercase">
                    Nhật ký dinh dưỡng
                </h2>

                <div className="mb-8 flex justify-center">
                    <Calendar
                        value={selectedDate}
                        onChange={setSelectedDate}
                        className="rounded-lg border shadow-xl p-2 bg-white"
                    />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow mb-10 border border-green-100">
                    <h3 className="text-xl font-semibold text-green-700 mb-3">
                        Tìm món ăn
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Nhập tên món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-green-300 px-3 py-1.5 rounded-md w-full sm:w-2/3 focus:ring-2 focus:ring-green-200 bg-white text-gray-900 text-base"
                        />
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-green-300 px-3 py-1.5 rounded-md w-24 focus:ring-2 focus:ring-green-200 bg-white text-gray-900 text-base"
                        />
                        <button
                            onClick={searchFoods}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    {searchResults.length > 0 && (
                        <ul className="mt-4 divide-y border-t">
                            {searchResults.map(food => (
                                <li key={food._id} className="flex justify-between items-center py-3">
                                    <span className="text-gray-800 font-medium">{food.name}</span>
                                    <button
                                        onClick={() => addFoodToLog(food._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 shadow"
                                    >
                                        Thêm
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow border border-green-100">
                    <h3 className="text-xl font-semibold text-green-700 mb-3">
                        Tổng kết ngày {formatDate(selectedDate)}
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border border-green-200 rounded-xl shadow bg-white">
                            <thead className="bg-green-50 text-green-900">
                                <tr>
                                    <th className="px-4 py-2 border-b font-bold">Món ăn</th>
                                    <th className="px-4 py-2 border-b font-bold">Số lượng</th>
                                    <th className="px-4 py-2 border-b font-bold">Calo</th>
                                    <th className="px-4 py-2 border-b font-bold">Protein</th>
                                    <th className="px-4 py-2 border-b font-bold">Carbs</th>
                                    <th className="px-4 py-2 border-b font-bold">Fat</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {mealLog.map(({ foodId, quantity }, idx) => (
                                    <tr key={idx} className="border-t hover:bg-green-50 transition">
                                        <td className="px-4 py-2 border-b font-semibold text-green-900">{foodId?.name}</td>
                                        <td className="px-4 py-2 border-b">{quantity}</td>
                                        <td className="px-4 py-2 border-b font-semibold text-orange-600">{(foodId?.calories * quantity).toFixed(1)}</td>
                                        <td className="px-4 py-2 border-b">{(foodId?.protein * quantity).toFixed(1)}</td>
                                        <td className="px-4 py-2 border-b">{(foodId?.carbs * quantity).toFixed(1)}</td>
                                        <td className="px-4 py-2 border-b">{(foodId?.fat * quantity).toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold bg-green-50 text-green-900">
                                    <td className="px-4 py-2 border-b" colSpan="2">Tổng</td>
                                    <td className="px-4 py-2 border-b">{totals.calories.toFixed(1)}</td>
                                    <td className="px-4 py-2 border-b">{totals.protein.toFixed(1)}</td>
                                    <td className="px-4 py-2 border-b">{totals.carbs.toFixed(1)}</td>
                                    <td className="px-4 py-2 border-b">{totals.fat.toFixed(1)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 mt-6 items-center justify-center">
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Cân nặng (kg)"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            className="border border-green-300 px-3 py-2 rounded-md w-40 focus:ring-2 focus:ring-green-200 bg-white text-gray-900 text-base"
                        />
                        <input
                            type="text"
                            placeholder="Ghi chú"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="border border-green-300 px-3 py-2 rounded-md w-60 focus:ring-2 focus:ring-green-200 bg-white text-gray-900 text-base"
                        />
                        <button
                            onClick={handleSubmitProgress}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition"
                        >
                            Chốt calo
                        </button>
                    </div>
                    {message && <div className="mt-4 text-green-700 font-semibold text-center">{message}</div>}
                </div>
            </div>
        </div>
    );

};

export default MealLog;
