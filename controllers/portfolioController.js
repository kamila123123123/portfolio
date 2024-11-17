const PortfolioItem = require('../models/PortfolioItem');

// Получение всех элементов портфолио
exports.getAllPortfolioItems = async (req, res) => {
  try {
    const items = await PortfolioItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Создание нового элемента портфолио
exports.createPortfolioItem = async (req, res) => {
  const { title, description, imageUrl, link } = req.body;

  if (!title || !description || !imageUrl || !link) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const newItem = new PortfolioItem({ title, description, imageUrl, link });
    await newItem.save();
    res.status(201).json({ message: 'Portfolio item created successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Обновление элемента портфолио
exports.updatePortfolioItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, link } = req.body;

  try {
    const updatedItem = await PortfolioItem.findByIdAndUpdate(
      id,
      { title, description, imageUrl, link },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ error: 'Item not found!' });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Удаление элемента портфолио
exports.deletePortfolioItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await PortfolioItem.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found!' });
    res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
