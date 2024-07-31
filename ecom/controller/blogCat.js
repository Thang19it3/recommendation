const Blog = require("../models/blogCat.js");
const User = require("../models/useModel");
const asyncHandler = require('express-async-handler');
const validateMoogoBnId = require("../utils/validateMooge");

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMoogoBnId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, 
            {
                new: true,
            });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getBlog = await Blog.findById(id);
        const updateView = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1},
            },
            {
                new: true,
            });
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const getAllBlog = await Blog.find();
        res.json(getAllBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
});




module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog
};