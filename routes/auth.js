const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const { register, login } = require('../controllers/authController');


router.post('/register', (req, res) => {
    res.send('Register route');
  });


// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, age, gender } = req.body;

    // Проверка на наличие обязательных полей
    if (!username || !password || !firstName || !lastName || !age || !gender) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const user = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            gender
        });

        // Сохранение пользователя в базе данных
        await user.save();

        // Отправка письма с подтверждением регистрации
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Отправка email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.username,
            subject: 'Welcome to Portfolio Platform',
            text: 'Thank you for registering on our platform. We are glad to have you!',
            html: `<p>Hi ${firstName},</p><p>Thank you for registering on our platform. We're excited to have you!</p>` // Можно использовать HTML
        });

        // Ответ пользователю
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        // Обработка ошибок
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

module.exports = router;
