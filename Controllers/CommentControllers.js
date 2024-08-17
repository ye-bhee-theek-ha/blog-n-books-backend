const Comment = require("../Models/CommentModels");
const Blog = require("../Models/BlogModels")

// Create a new comment
const addComment = async (req, res) => {
    try {
      const { blogPostId, content } = req.body;
      const authorId = req.user._id;
  
      const newComment = new Comment({
        content,
        author: authorId,
        blogPost: blogPostId,
      });
  
      const savedComment = await newComment.save();
  
      const blogPost = await Blog.findById(blogPostId);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
  
      blogPost.comments.push(savedComment._id);
      await blogPost.save();
  
      res.status(201).json({ message: "Comment added successfully", comment: savedComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Get comments for a blog post
const getCommentsForPost = async (req, res) => {
    try {
        const comments = await Comment.find({ blogPost: req.params.blogId }).populate('author', 'name');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(204).json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addComment,
    getCommentsForPost,
    updateComment,
    deleteComment
};
