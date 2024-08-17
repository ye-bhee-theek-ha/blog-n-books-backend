const Blog = require('../Models/BlogModels');
const Tag = require('../Models/TagModels');
const Comment = require('../Models/CommentModels');
const User = require("../Models/UserModels")
const slugify = require('slugify');


const extractDescription = (contentArray, numOfLines) => {
    let description = '';
    let linesAdded = 0;
  
    if (!Array.isArray(contentArray)) {
      return description;
    }
  
    for (const element of contentArray) {
      if (linesAdded >= numOfLines) break;
  
      const text = element.children.map(child => child.text).join(' ');
  
      if (text.trim()) {
        description += (description ? ' ' : '') + text;
        linesAdded++;
      }
    }
  
    return description;
};

// Create a new blog post
const createBlog = async (req, res) => {
    console.log(req.body);
    try {
        const { title, authorName, tags, content, publicationDate, visibility, status, image } = req.body;

        // Parse JSON content
        const parsedContent = JSON.parse(content);

        // Extract text from parsed content
        const extractText = (nodes) => {
            let text = '';
            if (nodes) {
                nodes.forEach(node => {
                    if (node.children) {
                        text += extractText(node.children);
                    } else if (node.text) {
                        text += node.text;
                    }
                });
            }
            return text;
        };

        const contentText = extractText(parsedContent);

        // Calculate word count and reading time
        const wordCount = contentText.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        // Generate a unique slug
        let slug = slugify(title, { lower: true, strict: true });
        let existingBlog = await Blog.findOne({ slug });
        let suffix = 1;
        while (existingBlog) {
            slug = `${slug}-${suffix}`;
            existingBlog = await Blog.findOne({ slug });
            suffix++;
        }

        const newBlog = new Blog({
            title,
            authorName,
            author: req.user._id,
            tags: JSON.parse(tags),
            content: JSON.stringify(parsedContent),
            publicationDate,
            visibility,
            status,
            featuredImage: image,
            wordCount,
            readingTime,
            slug
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
    try {

      let userId = null;
      let IsLiked = false;

      if (req.user) {
        userId = req.user._id;
      }

      const blogs = await Blog.find().select("title tags likes content readingTime featuredImage");
      const formattedBlogs = await Promise.all(
        blogs.map(async (blog) => {
            let contentArray;

            if (userId){
              const likeIndex = blog.likes.indexOf(userId);

              if (likeIndex !== -1)
              {
                IsLiked = true;
              }
            }

            try {
                contentArray = JSON.parse(blog.content);
            } catch (error) {
                console.error("Error parsing content JSON:", error);
                contentArray = [];
            }
            const description = extractDescription(contentArray, 2);

            const tags = await Tag.find({ _id: { $in: blog.tags } });
  
          return {
            id: blog._id,
            title: blog.title,
            tags,
            likes: blog.likes.length,
            isLiked: IsLiked,
            readTime: blog.readingTime,
            featuredImage: blog.featuredImage,
            description,
          };
        })
      );
  
      res.status(200).json(formattedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// Get a single blog post by ID
 const getBlogById = async (req, res) => {
    try {

      let userId = null;
      let IsLiked = false;

      if (req.user) {
        userId = req.user._id;
      }

        const blogId = req.params.id;

        const blog = await Blog.findById(blogId).populate('author', 'username email'); 

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        if (userId){
          const likeIndex = blog.likes.indexOf(userId);

          if (likeIndex !== -1)
          {
            IsLiked = true;
          }
        }

        const tagIds = blog.tags;
        const tags = await Tag.find({ _id: { $in: tagIds } });

        const commentIds = blog.comments; 
        const comments = await Comment.find({ _id: { $in: commentIds } }).populate('user', 'username');
        const author = await User.findById(blog.author);

        const blogData = {
            _id: blog._id,
            title: blog.title,
            author: {
                _id: author._id,
                name: author.name,
            },
            tags,
            comments,
            content: blog.content,
            publicationDate: blog.publicationDate,
            visibility: blog.visibility,
            likes: blog.likes.length,
            isLiked: IsLiked,
            status: blog.status,
            featuredImage: blog.featuredImage,
            wordCount: blog.wordCount,
            readingTime: blog.readingTime
        };

        res.json(blogData);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// get number of blogs likes by ID
const getBloglikes = async (req, res) => {
    try {
      const blogId = req.params.id;
      const userId = req.user._id;
  
      const blog = await Blog.findById(bookId);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      const isLiked = blog.likes.includes(userId);
      const likesCount = blog.likes.length;
  
      return res.status(200).json({ likesCount, isLiked });
  
    } catch (error) {
      console.error("Error finding number of likes of Blog:", error);
      res.status(500).json({ message: "Server error" });
    }
  };



// like a Blog by ID
const likeBlog = async (req, res) => {
    try {
      const BlogId = req.params.id;
      const userId = req.user._id; 
  
      const blog = await Blog.findById(BlogId);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      const likeIndex = blog.likes.indexOf(userId);
  
      if (likeIndex !== -1) {
        blog.likes.splice(likeIndex, 1);
        await blog.save();
        return res.status(200).json({ message: "blog unliked successfully", blog });
      } else {
        blog.likes.push(userId);
        await blog.save();
        return res.status(200).json({ message: "blog liked successfully", blog });
      }
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


// Update a blog post by ID
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a blog post by ID
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createBlog,
    getBlogById,
    getAllBlogs,
    deleteBlog,
    updateBlog,
    likeBlog,
    getBloglikes,
}