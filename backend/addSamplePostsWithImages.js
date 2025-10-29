const mongoose = require('mongoose');
const BlogNewsModel = require('./models/blogModel');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE_URL || 'mongodb://localhost:27017/neeon';

// Sample posts data with image URLs
const samplePosts = [
  {
    newsTitle: "Getting Started with React Hooks",
    newsDescription: "React Hooks have revolutionized how we write functional components. Learn the basics of useState, useEffect, and other essential hooks in this comprehensive guide.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 120,
    likes: 24,
    comments: 8,
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "The Future of Web Development",
    newsDescription: "Explore the latest trends and technologies shaping the future of web development. From WebAssembly to Progressive Web Apps, discover what's next for developers.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 210,
    likes: 42,
    comments: 15,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Modern CSS Techniques You Should Know",
    newsDescription: "CSS has evolved significantly in recent years. Discover modern techniques like CSS Grid, Flexbox, custom properties, and container queries that will elevate your styling skills.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 95,
    likes: 18,
    comments: 5,
    imageUrl: "https://images.unsplash.com/photo-1615962122169-6a27d96cc78d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Building Scalable Node.js Applications",
    newsDescription: "Learn best practices for building scalable Node.js applications. From architectural patterns to performance optimization, we cover everything you need to scale your backend.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 175,
    likes: 31,
    comments: 12,
    imageUrl: "https://images.unsplash.com/photo-1550615539-911b09de9a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Introduction to Machine Learning",
    newsDescription: "Machine Learning is transforming how we build applications. This beginner-friendly guide introduces key concepts, algorithms, and practical applications of ML.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 320,
    likes: 56,
    comments: 22,
    imageUrl: "https://images.unsplash.com/photo-1677442135722-5f11e06a4e0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "UI/UX Design Principles That Work",
    newsDescription: "Good design is more than aesthetics. Explore fundamental UI/UX principles that create intuitive, accessible, and engaging user experiences that drive business results.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 145,
    likes: 28,
    comments: 9,
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "JavaScript ES2024 New Features",
    newsDescription: "The JavaScript language continues to evolve. Discover the latest features introduced in ES2024 and how they can improve your code's readability and functionality.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 110,
    likes: 19,
    comments: 7,
    imageUrl: "https://images.unsplash.com/photo-1550615539-911b09de9a0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Database Design Best Practices",
    newsDescription: "A well-designed database is crucial for application performance and maintainability. Learn essential database design principles for both SQL and NoSQL systems.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 85,
    likes: 15,
    comments: 4,
    imageUrl: "https://images.unsplash.com/photo-1523617273955-d6eb24f3d1ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Responsive Design for All Devices",
    newsDescription: "With countless device sizes, responsive design is more important than ever. Master techniques to create layouts that work beautifully across all screen sizes.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 130,
    likes: 26,
    comments: 10,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "API Security Best Practices",
    newsDescription: "Security should be a top priority when building APIs. Explore essential security measures including authentication, rate limiting, and input validation.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 165,
    likes: 33,
    comments: 14,
    imageUrl: "https://images.unsplash.com/photo-1550522970-2c3e14d2e8d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Animation in Web Applications",
    newsDescription: "Well-crafted animations can enhance user experience significantly. Learn CSS, JavaScript, and library-based techniques for creating smooth, purposeful animations.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 90,
    likes: 17,
    comments: 6,
    imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "DevOps for Frontend Developers",
    newsDescription: "Modern frontend development involves more than just code. Understand deployment pipelines, CI/CD, and infrastructure concepts that every frontend developer should know.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 140,
    likes: 29,
    comments: 11,
    imageUrl: "https://images.unsplash.com/photo-1547658880-e61e53d7c33c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "The Power of Asynchronous Programming",
    newsDescription: "Discover how asynchronous programming works in JavaScript. From callbacks to promises to async/await, master the concepts that make modern web development possible.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 200,
    likes: 41,
    comments: 18,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Mobile-First Design Philosophy",
    newsDescription: "Mobile devices account for the majority of web traffic. Learn how to implement a mobile-first design approach that ensures your applications work beautifully on all devices.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 155,
    likes: 32,
    comments: 13,
    imageUrl: "https://images.unsplash.com/photo-1517466787924-5a95e8b2d6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Building Microservices with Docker",
    newsDescription: "Microservices architecture has transformed how we build applications. Learn how to create, containerize, and deploy microservices using Docker and other modern tools.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 275,
    likes: 48,
    comments: 20,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Color Theory in Digital Design",
    newsDescription: "Colors play a crucial role in user experience and brand identity. Master the principles of color theory and learn how to create effective color palettes for digital products.",
    category: "Design",
    postedBy: "Admin",
    status: "Published",
    views: 180,
    likes: 35,
    comments: 16,
    imageUrl: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    newsTitle: "Cloud Computing Fundamentals",
    newsDescription: "Cloud computing has revolutionized how we deploy and scale applications. Explore the major cloud providers, services, and architectural patterns for cloud-native applications.",
    category: "Technology",
    postedBy: "Admin",
    status: "Published",
    views: 225,
    likes: 44,
    comments: 19,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

async function addSamplePosts() {
  try {
    await mongoose.connect(DB);
    console.log('Connected to database');

    // Clear existing posts
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