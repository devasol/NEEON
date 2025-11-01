const mongoose = require('mongoose');
const Category = require('./models/categoryModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE_URL || 'mongodb://localhost:27017/neeon_dev';

const sampleCategories = [
  { name: "Technology" },
  { name: "Design" },
  { name: "Business" },
  { name: "Lifestyle" },
  { name: "Health" },
  { name: "Science" }
];

async function addSampleCategories() {
  try {
    await mongoose.connect(DB);
    console.log('Connected to database');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Add sample categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`Successfully added ${createdCategories.length} sample categories to the database`);

    // Verify the categories were added
    const allCategories = await Category.find({});
    console.log(`Total categories in database: ${allCategories.length}`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error adding sample categories:', error);
    process.exit(1);
  }
}

addSampleCategories();