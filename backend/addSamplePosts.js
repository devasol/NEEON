const mongoose = require('mongoose');
const BlogNewsModel = require('./models/blogModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE || process.env.MONGODB_URL || 'mongodb://localhost:27017/neeon';

// Sample posts data
const samplePosts = [
  {
    newsTitle: "Getting Started with React Hooks",
    newsDescription: "React Hooks have revolutionized how we write functional components. Learn the basics of useState, useEffect, and other essential hooks in this comprehensive guide.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 120,
    likes: 24,
    comments: 8
  },
  {
    newsTitle: "The Future of Web Development",
    newsDescription: "Explore the latest trends and technologies shaping the future of web development. From WebAssembly to Progressive Web Apps, discover what's next for developers.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 210,
    likes: 42,
    comments: 15
  },
  {
    newsTitle: "Modern CSS Techniques You Should Know",
    newsDescription: "CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 95,
    likes: 18,
    comments: 5
  },
  {
    newsTitle: "Building Scalable Node.js Applications",
    newsDescription: "Learn best practices for building scalable Node.js applications. From architectural patterns to performance optimization, we cover everything you need to scale your backend.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 175,
    likes: 31,
    comments: 12
  },
  {
    newsTitle: "Introduction to Machine Learning",
    newsDescription: "Machine Learning is transforming how we build applications. This beginner-friendly guide introduces key concepts, algorithms, and practical applications of ML.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 320,
    likes: 56,
    comments: 22
  },
  {
    newsTitle: "UI/UX Design Principles That Work",
    newsDescription: "Good design is more than aesthetics. Explore fundamental UI/UX principles that create intuitive, accessible, and engaging user experiences that drive business results.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 145,
    likes: 28,
    comments: 9
  },
  {
    newsTitle: "JavaScript ES2024 New Features",
    newsDescription: "The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 110,
    likes: 19,
    comments: 7
  },
  {
    newsTitle: "Database Design Best Practices",
    newsDescription: "A well-designed database is crucial for application performance and maintainability. Learn essential database design principles for both SQL and NoSQL systems.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 85,
    likes: 15,
    comments: 4
  },
  {
    newsTitle: "Responsive Design for All Devices",
    newsDescription: "With countless device sizes, responsive design is more important than ever. Master techniques to create layouts that work beautifully across all screen sizes.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 130,
    likes: 26,
    comments: 10
  },
  {
    newsTitle: "API Security Best Practices",
    newsDescription: "Security should be a top priority when building APIs. Explore essential security measures including authentication, rate limiting, and input validation.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 165,
    likes: 33,
    comments: 14
  },
  {
    newsTitle: "Animation in Web Applications",
    newsDescription: "Well-crafted animations can enhance user experience significantly. Learn CSS, JavaScript, and library-based techniques for creating smooth, purposeful animations.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 90,
    likes: 17,
    comments: 6
  },
  {
    newsTitle: "DevOps for Frontend Developers",
    newsDescription: "Modern frontend development involves more than just code. Understand deployment pipelines, CI/CD, and infrastructure concepts that every frontend developer should know.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 140,
    likes: 29,
    comments: 11
  }
];

async function addSamplePosts() {
  try {
    await mongoose.connect(DB);
    console.log('Connected to database');

    // Clear existing posts (if any)
    await BlogNewsModel.deleteMany({});
    console.log('Cleared existing posts');

    // Add sample posts
    const createdPosts = await BlogNewsModel.insertMany(samplePosts);
    console.log(`Successfully added ${createdPosts.length} sample posts to the database`);

    // Verify the posts were added
    const allPosts = await BlogNewsModel.find({});
    console.log(`Total posts in database: ${allPosts.length}`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error adding sample posts:', error);
    process.exit(1);
  }
}

addSamplePosts();