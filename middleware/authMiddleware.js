// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Извлекаем токен из заголовка

  if (!token) return res.status(401).json({ error: 'Access denied!' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token!' });

    req.user = user; // Добавляем информацию о пользователе в запрос
    next(); // Продолжаем выполнение запроса
  });
};

module.exports = { authenticateJWT };
