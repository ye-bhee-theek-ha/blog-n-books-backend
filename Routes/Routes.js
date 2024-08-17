const express = require('express');

const { 
    createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, likeBlog, getlBlogikes
} = require('../Controllers/BlogControllers');

const { 
    addComment, getCommentsForPost, updateComment, deleteComment 
} = require('../Controllers/CommentControllers');

const { 
    createTag, getTags, updateTag, deleteTag 
} = require('../Controllers/TagControllers');

const { 
    registerUser, loginUser, getInfo, toggleRole
} = require('../Controllers/UserControllers');

const {
    createBook, getAllBooks, getBookById, getBookDetailsById, updateBook, deleteBook, getAllBookIdsAndImages, likeBook, getBooklikes
} = require('../Controllers/BookControllers');


const { protect, authorizeAsAuthor } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = require("../config/multer")


// Blog Routes
router.route('/blogs')
    .post(protect, authorizeAsAuthor, createBlog)
    .get(getAllBlogs);

router.route('/blogs/:id')
    .get(getBlogById)
    .put(protect, authorizeAsAuthor, updateBlog)
    .delete(protect, authorizeAsAuthor, deleteBlog);

router.route('/blogs/like/:id')
    .post(protect, likeBlog)

// Book Routes
router.route('/books')
    .post(protect, authorizeAsAuthor, upload.single("bookfile"), createBook)
    .get(getAllBooks); 

router.route('/booksHomePage')
    .get(getAllBookIdsAndImages); 

router.route('/book/like/:id')
    .post(protect, likeBook)
    .get(protect, getBooklikes)


router.route('/book/:id')
    .get(getBookById)
    .put(protect, authorizeAsAuthor, updateBook)  
    .delete(protect, authorizeAsAuthor, deleteBook);

router.route('/bookDetails/:id')
    .get(getBookDetailsById)


// Comment Routes
router.route('/comments')
    .post(protect, addComment);

router.route('/comments/:blogId')
    .get(getCommentsForPost);

router.route('/comments/:commentId')
    .put(protect, updateComment)
    .delete(protect, deleteComment);


// Tag Routes
router.route('/tags')
    .post(protect, createTag)
    .get(getTags);


// User Routes
router.route('/users/register')
    .post(registerUser);

router.route('/users/login')
    .post(loginUser);

router.route('/users/toggleRole')
    .post(protect, toggleRole);

router.route('/users/getInfo')
    .get(protect, getInfo);

module.exports = router;
