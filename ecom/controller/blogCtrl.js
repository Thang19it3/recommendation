const Blog = require("../models/bllogModel");
const User = require("../models/useModel");
const asyncHandler = require('express-async-handler');
const validateMoogoBnId = require("../utils/validateMooge");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require('fs')

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
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
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

const likeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMoogoBnId(blogId);

    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
        { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $pull: { likes: loginUserId },
            isLiked: false,
        },
        { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $push: { likes: loginUserId },
            isLiked: true,
        },
        { new: true }
        );
        res.json(blog);
    }
});

const disLikeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req.body;
    validateMoogoBnId(blogId);

    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $pull: { likes: loginUserId },
            isLiked: false,
        },
        { new: true }
        );
        res.json(blog);
    }
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },
        { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        },
        { new: true }
        );
        res.json(blog);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const {
        id
    } = req.params;
    validateMoogoBnId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const {
                path
            } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        }, {
            new: true,
        });
        res.json(findBlog);
    } catch (error) {
        throw new Error(error)
    }
});



module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    uploadImages
};