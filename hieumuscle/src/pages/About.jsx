import React from 'react';
import { FaGithub, FaEnvelope, FaDumbbell, FaRegLightbulb, FaUserCircle, FaBookOpen } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 py-10 flex justify-center items-start">
            <div className="max-w-2xl w-full bg-white/95 p-8 rounded-3xl shadow-2xl border border-blue-100">
                <div className="flex flex-col items-center mb-8">
                    <FaDumbbell className="text-green-600 text-5xl mb-2" />
                    <h2 className="text-3xl font-extrabold text-center text-blue-800 tracking-wide drop-shadow-lg uppercase mb-2">
                        Muscle Tracker
                    </h2>
                    <p className="text-gray-600 text-center font-medium mb-2">Ứng dụng quản lý dinh dưỡng, tiến độ sức khoẻ & lịch tập luyện cá nhân</p>
                </div>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUserCircle className="text-blue-500 text-xl" />
                        <h3 className="text-xl font-bold text-blue-700">Người phát triển</h3>
                    </div>
                    <ul className="ml-7 text-gray-800">
                        <li><span className="font-semibold">Nguyễn Hữu Hiếu</span></li>
                        <li className="flex items-center gap-2"><FaEnvelope className="inline text-green-600" /> n.h.hieu2112@gmail.com</li>
                        <li className="flex items-center gap-2"><FaGithub className="inline text-gray-700" /> <a href="https://github.com/hiucdh" className="underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">github.com/hiucdh</a></li>
                    </ul>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <FaRegLightbulb className="text-yellow-500 text-xl" />
                        <h3 className="text-xl font-bold text-blue-700">Mục tiêu dự án</h3>
                    </div>
                    <ul className="ml-7 text-gray-800 list-disc">
                        <li>Hỗ trợ xây dựng thói quen ăn uống, tập luyện khoa học.</li>
                        <li>Theo dõi tiến độ sức khoẻ, cân nặng, calories hằng ngày.</li>
                        <li>Đơn giản, dễ dùng, giao diện hiện đại.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <FaBookOpen className="text-green-600 text-xl" />
                        <h3 className="text-xl font-bold text-blue-700">Hướng dẫn sử dụng nhanh</h3>
                    </div>
                    <ul className="ml-7 text-gray-800 list-disc">
                        <li><b>MealLog:</b> Nhập món ăn, số lượng, chốt calo mỗi ngày.</li>
                        <li><b>Progress:</b> Xem biểu đồ cân nặng, calories, lịch sử tiến độ.</li>
                        <li><b>Calendar:</b> Quản lý lịch tập, thêm/xoá/sửa bài tập từng ngày.</li>
                        <li><b>Profile:</b> Xem và chỉnh sửa thông tin cá nhân, chiều cao, cân nặng.</li>
                    </ul>
                </section>

                <section className="mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <FaEnvelope className="text-green-600 text-xl" />
                        <h3 className="text-xl font-bold text-blue-700">Liên hệ & đóng góp</h3>
                    </div>
                    <p className="ml-7 text-gray-800">
                        Mọi góp ý, bug, hoặc ý tưởng mới xin gửi về email hoặc Github.<br />
                        <span className="font-semibold">Cảm ơn bạn đã sử dụng Muscle Tracker!</span>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;