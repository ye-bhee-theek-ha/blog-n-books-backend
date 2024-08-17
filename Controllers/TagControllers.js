const Tag = require("../Models/TagModels");

// Create a new tag
const createTag = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name });

        if (existingTag) {
            return res.status(400).json({ error: "Tag already exists" });
        }

        const newTag = new Tag({ name });
        await newTag.save();
        res.status(201).json(newTag);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tags
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a tag
const updateTag = async (req, res) => {
    try {
        const updatedTag = await Tag.findByIdAndUpdate(req.params.tagId, req.body, { new: true });
        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a tag
const deleteTag = async (req, res) => {
    try {
        await Tag.findByIdAndDelete(req.params.tagId);
        res.status(204).json({ message: "Tag deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTag,
    getTags,
    updateTag,
    deleteTag
};
 