const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Для создания токенов при входе
const speakeasy = require('speakeasy');

// Регистрация нового пользователя
exports.register = async (req, res) => {
  const { username, password, firstName, lastName, age, gender } = req.body;

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
      gender,
    });

    // Сохранение пользователя в базе данных
    await user.save();

    // Настройка Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Или ваш email сервис
      auth: {
        user: process.env.EMAIL_USER,  // Email из .env
        pass: process.env.EMAIL_PASS,  // Пароль из .env
      },
    });

    // Отправка письма с приветствием
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.username,  // Адрес пользователя
      subject: 'Welcome to Portfolio Platform',
      text: `Hello ${user.firstName},\n\nThank you for registering on our platform! We're excited to have you on board.\n\nBest regards,\nThe Portfolio Team`,
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  const { username, password, token } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required!' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found!' });

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials!' });

    // Если у пользователя включен 2FA
    if (user.twoFactorEnabled) {
      // Проверка 2FA
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,  // Токен, отправленный пользователем
      });
      if (!verified) return res.status(400).json({ error: 'Invalid 2FA token!' });
    }

    // Создание JWT токена
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token: jwtToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Генерация 2FA для пользователя (можно добавить в свой контроллер)
exports.enableTwoFactor = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required to enable 2FA!' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found!' });

    // Генерация секрета для 2FA
    const secret = speakeasy.generateSecret({ length: 20 });

    // Сохранение секрета в базе данных
    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = true;
    await user.save();

    // Отправка QR-кода пользователю
    const otpauthUrl = secret.otpauth_url;

    res.status(200).json({
      message: '2FA enabled successfully!',
      qrCodeUrl: otpauthUrl, // URL для QR-кода
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
