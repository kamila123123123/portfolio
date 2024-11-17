const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [String], // Store image URLs or file paths
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);
