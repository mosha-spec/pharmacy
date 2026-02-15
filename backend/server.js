const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد استقبال البيانات من الصفحات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// لينك الربط الخاص بك من MongoDB
const mongoURI = "mongodb+srv://mosha_khaled:MOSHA123m@cluster0.aiiqjp1.mongodb.net/pharmacy?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ تم الاتصال بالخزنة السحابية بنجاح!"))
  .catch(err => console.error("❌ فشل الاتصال:", err));

// --- تعريف قواعد البيانات ---

// شكل بيانات الدواء
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    barcode: String,
    date: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// شكل المصروفات
const expenseSchema = new mongoose.Schema({
    reason: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', expenseSchema);

// --- الربط بالملفات والصور ---

// 1. خليه يشوف كل الملفات (الصور والصفحات) في الفولدر الرئيسي
app.use(express.static(__dirname));

// 2. خليه يفتح صفحة index.html أول ما الموقع يفتح (ده الأساس)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. صفحة الباسورد (لو حبيت تروح لها يدوي بـ /login)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// --- الأوامر (العمليات) ---

// إضافة دواء جديد للسحابة
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// عرض كل الأدوية من السحابة للجدول
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json([]);
    }
});

// استقبال مصروف جديد وحفظه
app.post('/add-expense', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        await newExpense.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`🚀 السيرفر جاهز على بورت ${PORT}`));

