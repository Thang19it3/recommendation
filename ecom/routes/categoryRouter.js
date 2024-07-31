const express = require('express');
const router = express.Router();
const { authMiddWare, isAdmin } = require('../middleware/authMiddWare'); 
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controller/categoryCtrl');

router.post("/", authMiddWare, isAdmin, createCategory);
router.put("/:id", authMiddWare, isAdmin, updateCategory);
router.delete("/:id", authMiddWare, isAdmin, deleteCategory);
router.get("/:id", authMiddWare, isAdmin, getCategory);
router.get("/", getAllCategory);

module.exports = router;