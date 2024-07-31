const express = require('express');
const router = express.Router();
const { authMiddWare, isAdmin } = require('../middleware/authMiddWare');
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog } = require('../controller/blogCat.js');

router.post("/" ,authMiddWare, isAdmin, createBlog);
router.put("/:id", authMiddWare, isAdmin, updateBlog);
router.get("/:id",  getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddWare, isAdmin, deleteBlog);


module.exports = router;