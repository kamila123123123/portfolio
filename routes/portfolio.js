// routes/portfolio.js
const express = require('express');
const router = express.Router();
const { getAllPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } = require('../controllers/portfolioController');

// Получение всех элементов портфолио
router.get('/', getAllPortfolioItems);

// Создание нового элемента портфолио
router.post('/', createPortfolioItem);

// Обновление элемента портфолио
router.put('/:id', updatePortfolioItem);

// Удаление элемента портфолио
router.delete('/:id', deletePortfolioItem);

module.exports = router;
