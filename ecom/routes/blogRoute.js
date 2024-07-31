const express = require('express');
const router = express.Router();
const { authMiddWare, isAdmin } = require('../middleware/authMiddWare');
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog, uploadImages } = require('../controller/blogCtrl');
const {uploadPhoto, blogImgResize } = require('../middleware/uploadImage');


router.post("/" ,authMiddWare, isAdmin, createBlog);
router.put("/upload/:id", authMiddWare, isAdmin, uploadPhoto.array('images', 2), blogImgResize, uploadImages);
router.put("/likes", authMiddWare, likeBlog);
router.put("/dislikes", authMiddWare, disLikeBlog);
router.put("/:id", authMiddWare, isAdmin, updateBlog);
router.get("/:id",  getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddWare, isAdmin, deleteBlog);


module.exports = router;