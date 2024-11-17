const express = require('express');
const router = express.Router();

// Пример маршрута для админской панели
router.get('/', (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

module.exports = router;
