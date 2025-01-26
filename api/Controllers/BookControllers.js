const Book = require('../Models/BookModels');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { conn, getGfs } = require('../config/gfs');
const upload = require('../config/multer');

// Create a new book with file upload
const createBook = async (req, res) => {
    try {
      console.log("File received:", req.file);
  
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const { title, description, author, tags, featuredImage } = req.body;

      console.log("body received:", req.body);
      
      const newBook = new Book({
        title,
        author,
        description,
        "uploader": req.user._id,
        tags: JSON.parse(tags),
        featuredImage,
        file: {
          filename: req.file.filename,
          id: req.file.id
        },
      });
  
      await newBook.save();
      res.status(201).json(newBook);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: error.message });
    }
  };


// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate('uploader', 'name _id')
            .populate('tags', 'name');
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all books only id and image
const getAllBookIdsAndImages = async (req, res) => {
  try {
      const books = await Book.find({ visibility: 'public' }, '_id featuredImage');
      res.status(200).json(books);
  } catch (error) {
      console.error('Error fetching book IDs and featured images:', error);
      res.status(500).json({ error: 'Server error' });
  }
};

// Get a single book by ID
const getBookDetailsById = async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


const getBookById = async (req, res) => {
    const bookId = req.params.id;
    const gfs = getGfs();

    try {
      const book = await Book.findById(bookId);
      if (!book || !book.file || !book.file.id) {
        return res.status(404).json({ error: 'Book or file not found' });
      }
  
      const fileId = book.file.id;
          
      let fileObjectId;
      if (mongoose.mongo.ObjectId.isValid(fileId) && typeof fileId === 'object') {
        fileObjectId = fileId;
      } else if (mongoose.mongo.ObjectId.isValid(fileId)) {
        fileObjectId = new mongoose.mongo.ObjectId(fileId);
      } else {
        return res.status(400).json({ error: 'Invalid file ID format' });
      }
  
      if (!gfs) {
        return res.status(500).json({ error: 'GridFS is not initialized' });
      }
      
      const file = await gfs.files.findOne({ _id: fileObjectId });

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      if (file.contentType !== 'application/pdf') {
        return res.status(404).json({ error: 'Not a PDF file' });
      }

      if (!file) {
          return res.status(404).json({ error: 'File not found' });
      }

      if (file.contentType !== 'application/pdf') {
          return res.status(404).json({ error: 'Not a PDF file' });
      }

      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
          bucketName: 'BookUploads'
      });

      const readstream = bucket.openDownloadStream(file._id);
      res.set('Content-Type', file.contentType);
      readstream.pipe(res);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  

// Update a book by ID
const updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// like a book by ID
const likeBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id; 

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const likeIndex = book.likes.indexOf(userId);

    if (likeIndex !== -1) {
      book.likes.splice(likeIndex, 1);
      await book.save();
      return res.status(200).json({ message: "Book unliked successfully", book });
    } else {
      book.likes.push(userId);
      await book.save();
      return res.status(200).json({ message: "Book liked successfully", book });
    }
  } catch (error) {
    console.error("Error liking/unliking book:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// get number of book likes by ID
const getBooklikes = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id; // Assuming you have the user ID from req.user

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already liked the book
    const isLiked = book.likes.includes(userId);
    const likesCount = book.likes.length;

    return res.status(200).json({ likesCount, isLiked });

  } catch (error) {
    console.error("Error finding number of likes of book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    const gfs = getGfs();

    try {
        // Find the book to get the file ID
        const book = await Book.findById(bookId);
        if (!book || !book.file || !book.file.id) {
            return res.status(404).json({ error: 'Book or file not found' });
        }

        const fileId = book.file.id;

        // Validate the fileId format
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ error: 'Invalid file ID format' });
        }

        // Convert fileId to ObjectId
        const fileObjectId = new mongoose.Types.ObjectId(fileId);

        // Delete the book document
        await Book.findByIdAndDelete(bookId);

        // Delete the file from GridFS
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'BookUploads'
        });

        bucket.delete(fileObjectId, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error deleting file from GridFS' });
            }
            res.status(200).json({ message: 'Book and file deleted successfully' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    getAllBookIdsAndImages, 
    getBookDetailsById,
    updateBook,
    deleteBook,
    likeBook,
    getBooklikes
};
