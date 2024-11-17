const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Подключаем маршруты
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const adminRoutes = require('./routes/admin');  // Например, добавим маршруты для админки

// Подключаем middleware для аутентификации и авторизации
const { authenticateJWT } = require('./middleware/authMiddleware');

// Настройки .env
dotenv.config();

// Инициализация приложения
const app = express();

// Подключение к MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();

// Настройки сессий
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Для HTTPS используйте secure: true в production
  })
);

// Middleware для обработки тела запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Установка движка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Главная страница
app.get('/', (req, res) => {
  res.render('index', { title: 'Portfolio Platform', user: req.session.user });
});

// Подключение маршрутов
app.use('/auth', authRoutes);  // Маршруты для авторизации
app.use('/portfolio', authenticateJWT, isEditor, portfolioRoutes);  // Защищенные маршруты для портфолио (только для авторизованных пользователей с ролью editor или admin)
app.use('/admin', authenticateJWT, isAdmin, adminRoutes);  // Защищенные маршруты для админов

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Глобальная обработка ошибок (например, ошибки сервера)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error', error: err });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
