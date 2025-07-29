import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        height: '',
        weight: ''
    })
    const [isEditing, setIsEditing] = useState(false)
    const [message, setMessage] = useState('')

    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.userId

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/profile/${userId}`)
                setUserInfo(res.data)
            } catch (err) {
                console.error('❌ Lỗi lấy thông tin người dùng:', err)
            }
        }

        if (userId) fetchProfile()
    }, [userId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/profile/${userId}`, {
                height: userInfo.height,
                weight: userInfo.weight
            })
            setMessage('✅ Cập nhật thành công!')
            setIsEditing(false)
        } catch (err) {
            console.error('❌ Lỗi cập nhật hồ sơ:', err)
            setMessage('❌ Cập nhật thất bại!')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 py-10 flex justify-center items-start">
            <div className="max-w-lg w-full bg-white/95 p-8 rounded-3xl shadow-2xl border border-blue-100">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800 tracking-wide drop-shadow-lg uppercase">
                    Hồ sơ người dùng
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block font-medium text-gray-600 mb-1">Username:</label>
                        <div className="bg-blue-50 rounded-lg px-4 py-2 text-blue-900 font-semibold shadow-inner">{userInfo.username}</div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-600 mb-1">Email:</label>
                        <div className="bg-blue-50 rounded-lg px-4 py-2 text-blue-900 font-semibold shadow-inner">{userInfo.email}</div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-600 mb-1">Chiều cao (cm):</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="height"
                                value={userInfo.height}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-200 bg-white text-gray-900 text-base shadow"
                            />
                        ) : (
                            <div className="bg-green-50 rounded-lg px-4 py-2 text-green-900 font-semibold shadow-inner">{userInfo.height || 'Chưa có'}</div>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-600 mb-1">Cân nặng (kg):</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="weight"
                                value={userInfo.weight}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-200 bg-white text-gray-900 text-base shadow"
                            />
                        ) : (
                            <div className="bg-green-50 rounded-lg px-4 py-2 text-green-900 font-semibold shadow-inner">{userInfo.weight || 'Chưa có'}</div>
                        )}
                    </div>

                    {message && <p className="text-sm text-center text-blue-600 font-semibold">{message}</p>}

                    <div className="text-center mt-6">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleUpdate}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition mr-2"
                                >
                                    Lưu
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-300 transition"
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
