// importFoods.js
import mongoose from 'mongoose';
import fs from 'fs';
import Food from './models/Foods.js'; // đúng path
import { removeVietnameseTones } from './utils/removeVietnamese.js';
// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/hieumuscle', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
    importData();
}).catch(err => {
    console.error('❌ Connection error:', err);
});

const importData = async () => {
    try {
        const rawData = JSON.parse(fs.readFileSync('./foods.json', 'utf-8'));

        // ✅ thêm nameUnsigned
        const data = rawData.map((food, index) => ({
            ...food,
            code: `FO${(index + 1).toString().padStart(3, '0')}`,
            nameUnsigned: removeVietnameseTones(food.name).toLowerCase()
        }));

        await Food.deleteMany();
        await Food.insertMany(data);
        console.log(`✅ Import thành công ${data.length} món ăn.`);
        process.exit();
    } catch (err) {
        console.error('❌ Lỗi import:', err);
        process.exit(1);
    }
};
