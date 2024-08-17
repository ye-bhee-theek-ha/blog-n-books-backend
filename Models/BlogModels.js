// blogData.js
const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for authors
        required: true,
    },
    publicationDate: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedDate: {
        type: Date,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    visibility: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'public',
    },
    status: {
        type: String,
        enum: ['Published', 'Draft', 'Archived'],
        default: 'Published',
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    featuredImage: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    wordCount: {
        type: Number,
        default: function () {
            const content = JSON.parse(this.content)
            return content.split(/\s+/).length;
        }
    },
    readingTime: {
        type: Number,
        default: function () {
            return Math.ceil(this.wordCount / 200);
        }
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    }
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
