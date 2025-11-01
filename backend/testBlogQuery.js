const mongoose = require('mongoose');
const BlogNewsModel = require('./models/blogModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE_URL || 'mongodb://localhost:27017/neeon_dev';

async function testQuery() {
  try {
    await mongoose.connect(DB);
    console.log('Connected to database');

    // Get all blogs to see their structure and status
    const allBlogs = await BlogNewsModel.find({});
    console.log(`Total blogs in database: ${allBlogs.length}`);
    allBlogs.forEach((blog, index) => {
      console.log(`Blog ${index + 1}: Title: "${blog.newsTitle}", Status: "${blog.status}"`);
    });

    // Get only published blogs (this is what the public endpoint should return)
    const publishedBlogs = await BlogNewsModel.find({ status: "Published" });
    console.log(`\nPublished blogs: ${publishedBlogs.length}`);
    publishedBlogs.forEach((blog, index) => {
      console.log(`Published Blog ${index + 1}: Title: "${blog.newsTitle}", Status: "${blog.status}"`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error querying blogs:', error);
    process.exit(1);
  }
}

testQuery();