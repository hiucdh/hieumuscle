import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!')
            return
        }

        try {
            const res = await axios.post('http://localhost:8080/api/register', {
                username,
                email,
                password
            })
            alert(res.data.message)
            navigate('/login')
        } catch (err) {
            console.log('❌ Lỗi đăng ký:', err.response?.data)
            setError(err.response?.data?.message || 'Đăng ký thất bại')
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 p-6 space-y-6">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                    Create an account
                </h1>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="yourname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-blue-600 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </section>
    )
}

export default Register
