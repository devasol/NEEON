const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
