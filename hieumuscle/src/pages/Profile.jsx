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
        <div className="max-w-xl mx-auto mt-20 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Hồ sơ người dùng</h2>

            <div className="space-y-4">
                <div>
                    <label className="block font-medium text-gray-600">Username:</label>
                    <p className="text-gray-900">{userInfo.username}</p>
                </div>

                <div>
                    <label className="block font-medium text-gray-600">Email:</label>
                    <p className="text-gray-900">{userInfo.email}</p>
                </div>

                <div>
                    <label className="block font-medium text-gray-600">Chiều cao (cm):</label>
                    {isEditing ? (
                        <input
                            type="number"
                            name="height"
                            value={userInfo.height}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p className="text-gray-900">{userInfo.height || 'Chưa có'}</p>
                    )}
                </div>

                <div>
                    <label className="block font-medium text-gray-600">Cân nặng (kg):</label>
                    {isEditing ? (
                        <input
                            type="number"
                            name="weight"
                            value={userInfo.weight}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p className="text-gray-900">{userInfo.weight || 'Chưa có'}</p>
                    )}
                </div>

                {message && <p className="text-sm text-center text-blue-600">{message}</p>}

                <div className="text-center">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            >
                                Hủy
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
