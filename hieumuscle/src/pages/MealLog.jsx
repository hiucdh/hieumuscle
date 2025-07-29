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
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Nhật ký dinh dưỡng
            </h2>

            <div className="mb-6 flex justify-center">
                <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="rounded-lg border shadow-sm p-2"
                />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Tìm món ăn
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Nhập tên món ăn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded w-full sm:w-2/3"
                    />
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border border-gray-300 px-4 py-2 rounded w-28"
                    />
                    <button
                        onClick={searchFoods}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Thêm
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                    Tổng kết ngày {formatDate(selectedDate)}
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border">Món ăn</th>
                                <th className="px-4 py-2 border">Số lượng</th>
                                <th className="px-4 py-2 border">Calo</th>
                                <th className="px-4 py-2 border">Protein</th>
                                <th className="px-4 py-2 border">Carbs</th>
                                <th className="px-4 py-2 border">Fat</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {mealLog.map(({ foodId, quantity }, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2 border">{foodId?.name}</td>
                                    <td className="px-4 py-2 border">{quantity}</td>
                                    <td className="px-4 py-2 border">{(foodId?.calories * quantity).toFixed(1)}</td>
                                    <td className="px-4 py-2 border">{(foodId?.protein * quantity).toFixed(1)}</td>
                                    <td className="px-4 py-2 border">{(foodId?.carbs * quantity).toFixed(1)}</td>
                                    <td className="px-4 py-2 border">{(foodId?.fat * quantity).toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold bg-blue-50 text-blue-900">
                                <td className="px-4 py-2 border" colSpan="2">Tổng</td>
                                <td className="px-4 py-2 border">{totals.calories.toFixed(1)}</td>
                                <td className="px-4 py-2 border">{totals.protein.toFixed(1)}</td>
                                <td className="px-4 py-2 border">{totals.carbs.toFixed(1)}</td>
                                <td className="px-4 py-2 border">{totals.fat.toFixed(1)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="flex flex-col md:flex-row gap-2 mt-4 items-center">
                    <input
                        type="number"
                        step="0.1"
                        placeholder="Cân nặng (kg)"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="border px-3 py-1 rounded w-40"
                    />
                    <input
                        type="text"
                        placeholder="Ghi chú"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="border px-3 py-1 rounded w-60"
                    />
                    <button
                        onClick={handleSubmitProgress}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Chốt calo
                    </button>
                </div>
                {message && <div className="mt-2 text-blue-600 font-semibold">{message}</div>}
            </div>
        </div>
    );

};

export default MealLog;
