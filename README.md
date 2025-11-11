# NEEON - Full-Stack Blog Platform

![NEEON Logo](/frontend/public/readme/homepage-light.png)

**NEEON** is a modern, full-stack blog platform built with React, Node.js, Express, and MongoDB. It provides a complete solution for content creation, management, and presentation with both user-facing and admin interfaces.

## Features

### User Features

- **Browse Content**: Beautifully designed landing page with featured posts
- **Category Browsing**: Filter posts by categories
- **Interactive Posts**: Like and comment on posts
- **Contact Form**: Reach out to the blog administrators
- **Responsive Design**: Works seamlessly on all devices
- **Google OAuth**: Secure authentication with Google
- **Dark/Light Theme**: Toggle between different themes

### Admin Features

- **Dashboard Analytics**: Real-time statistics and insights
- **Content Management**: Create, edit, and delete posts
- **User Management**: View and manage registered users
- **Comment Moderation**: Review and manage comments
- **Category Management**: Organize content with categories
- **Post Analytics**: Track views and engagement

### Technical Features

- **Authentication & Authorization**: JWT-based security
- **File Upload**: Support for images and other media
- **API Documentation**: RESTful API endpoints
- **Performance Optimized**: Fast loading and smooth interactions
- **SEO Friendly**: Proper meta tags and structure

## 🛠 Tech Stack

### Frontend

- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **React Router DOM 7.9.4** - Declarative routing for React
- **Vite 7.1.6** - Next-generation frontend build tool
- **CSS Modules** - Scoped CSS for components
- **JWT Decode** - Decoding JWT tokens in the browser
- **Recharts** - Charting library for analytics
- **React Icons** - SVG icon library

### Backend

- **Node.js** - JavaScript runtime environment
- **Express 5.1.0** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.18.1** - MongoDB object modeling
- **Passport.js** - Authentication middleware (Google OAuth)
- **JSON Web Tokens** - Secure token-based authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Dotenv** - Environment variable management

### Additional Tools

- **ESLint** - Code linting
- **Cors** - Cross-Origin Resource Sharing
- **Validator** - String validation

## 📁 Project Structure

```
NEEON/
├── backend/                 # Server-side code
│   ├── config/              # Configuration files
│   ├── controllers/         # Business logic
│   ├── models/              # Database schemas
│   ├── routes/              # API routes
│   ├── uploads/             # File uploads storage
│   ├── utils/               # Utility functions
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
├── frontend/                # Client-side code
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite build configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or Atlas)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/devasol/NEEON.git
   cd NEEON
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   In the `backend` directory, create a `.env` file with the following variables based on `config.env.example`:

   ```env
   # Database Configuration
   DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/neeon_db

   # Server Configuration
   PORT=9000
   NODE_ENV=development

   # Security Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=90d

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Session Configuration
   SESSION_SECRET=your_session_secret

   # Application URLs
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:9000

   # Email Configuration (optional)
   EMAIL=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

5. **Run the application**

   - **Start the backend server:**

     ```bash
     cd backend
     npm start
     ```

   - **Start the frontend development server:**
     ```bash
     cd frontend
     npm run dev
     ```

   The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:9000`.

## 🧪 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend

- `npm start` - Start server with nodemon

## 🔧 API Endpoints

### Authentication

- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Posts

- `GET /api/v1/blogs` - Get all posts
- `GET /api/v1/blogs/:id` - Get specific post
- `POST /api/v1/blogs` - Create new post (Admin only)
- `PATCH /api/v1/blogs/:id` - Update post (Admin only)
- `DELETE /api/v1/blogs/:id` - Delete post (Admin only)
- `GET /api/v1/blogs/public` - Get public posts
- `GET /api/v1/blogs/:id/comments` - Get comments for post

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PATCH /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Analytics

- `GET /api/v1/analytics/dashboard-stats` - Dashboard statistics
- `GET /api/v1/analytics/recent-posts` - Recent posts data
- `GET /api/v1/analytics/users` - User analytics

### Contact

- `POST /api/contact` - Submit contact form

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Admin users have special permissions to manage content.

OAuth with Google is also supported for easy registration and login.

## 🗂 Database Schema

### User

- `_id`: ObjectId
- `email`: String
- `password`: String (hashed)
- `name`: String (optional)
- `role`: String (user/admin)
- `googleId`: String (optional)

### Blog Post

- `_id`: ObjectId
- `newsTitle`: String
- `newsDescription`: String
- `category`: String
- `postedBy`: String
- `datePosted`: Date
- `image`: String (file path)
- `likes`: Number
- `comments`: Array of comment objects
- `views`: Number
- `published`: Boolean

### Category

- `_id`: ObjectId
- `name`: String
- `description`: String (optional)

## 📊 Admin Dashboard

The admin dashboard provides comprehensive management tools:

- **Analytics**: View statistics on posts, users, and engagement
- **Content Management**: Create, edit, and delete posts
- **User Management**: View and manage registered users
- **Comment Moderation**: Review and manage comments
- **Category Management**: Organize content categories
- **System Settings**: Configure platform settings

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/devasol/NEEON](https://github.com/devasol/NEEON)

## 🙏 Acknowledgments

- React community for the amazing library
- Express.js for the robust framework
- MongoDB for the scalable database
- All the open-source packages that made this project possible
  
---

<p align="center">
Made with Dawit S. using React, Node.js, and MongoDB
</p>
