# Blog and Books Backend API

Welcome to the backend API repository for Blog and Books! This project provides a robust backend solution for managing blogs, books, comments, tags, and user authentication.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Blog Routes](#blog-routes)
  - [Book Routes](#book-routes)
  - [Comment Routes](#comment-routes)
  - [Tag Routes](#tag-routes)
- [Directory Structure](#directory-structure)
- [Additional Functionality](#additional-functionality)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Management**: Register and login users with JWT authentication.
- **Blog Management**: Create, update, delete, and retrieve blogs with tags, comments, and related posts.
- **Book Management**: Upload, update, delete, and retrieve books with metadata and file storage using GridFS.
- **Comment System**: Allow users to comment on blogs with full CRUD functionality.
- **Tag Management**: CRUD operations for tags associated with blogs and books.
- **Middleware**: Error handling, authentication, and authorization middleware.
- **File Uploads**: Support for uploading and managing large files (e.g., books).

## Technologies Used
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **GridFS**: MongoDB's specification for storing large files
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing for secure user authentication
- **Multer**: Middleware for handling multipart/form-data (file uploads)
- **Nodemailer**: Node.js module for sending emails

## Getting Started
### Prerequisites
- Node.js (v12 or higher)
- MongoDB Atlas account or local MongoDB installation

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   
2. Install dependencies:
    npm install
   
3. Set up environment variables:
    Create a .env file based on .env.example.
    Update the MONGO_URI, JWT_SECRET, and other variables as needed.

### Running the Application
  npm start

## API Endpoints

### User Routes:
- **POST** `/api/users/register`: Register a new user.
- **POST** `/api/users/login`: Login existing user.

### Blog Routes:
- **POST** `/api/blogs`: Create a new blog post.
- **GET** `/api/blogs`: Get all blog posts.
- **GET** `/api/blogs/:id`: Get a single blog post by ID.
- **PUT** `/api/blogs/:id`: Update a blog post by ID.
- **DELETE** `/api/blogs/:id`: Delete a blog post by ID.

### Book Routes:
- **POST** `/api/books`: Upload a new book.
- **GET** `/api/books`: Get all books.
- **GET** `/api/books/:id`: Get a single book by ID.
- **PUT** `/api/books/:id`: Update a book by ID.
- **DELETE** `/api/books/:id`: Delete a book by ID.

### Comment Routes:
- **POST** `/api/comments`: Create a new comment.
- **GET** `/api/comments/:blogId`: Get comments for a specific blog post.
- **PUT** `/api/comments/:commentId`: Update a comment by ID.
- **DELETE** `/api/comments/:commentId`: Delete a comment by ID.

### Tag Routes:
- **POST** `/api/tags`: Create a new tag.
- **GET** `/api/tags`: Get all tags.
- **PUT** `/api/tags/:tagId`: Update a tag by ID.
- **DELETE** `/api/tags/:tagId`: Delete a tag by ID.

## Directory Structure

- **config/**: Configuration files (e.g., database connection, multer setup).
- **controllers/**: Request handlers for each endpoint (e.g., BlogControllers, UserControllers).
- **middlewares/**: Custom middleware functions (e.g., authentication, error handling).
- **models/**: Mongoose schemas and models (e.g., BlogModels, UserModels).
- **routes/**: Route definitions using Express Router (e.g., Routes.js).
- **server.js**: Main entry point to start the Express server.



## Additional Functionality
- **Search Functionality**: Implement search endpoints to allow users to search for blogs or books based on keywords, tags, or other criteria.
- **User Profiles**: Develop endpoints to manage user profiles, including updating user information, viewing user details, and managing user preferences.
- **Analytics and Insights**: Implement analytics features to track metrics such as page views, likes, comments, and downloads for blogs and books.

## Contributing
Contributions are welcome! Feel free to fork the repository, open issues, and submit pull requests.

## License
This project is licensed under the ISC License.
