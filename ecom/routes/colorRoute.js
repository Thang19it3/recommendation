const express = require('express');
const router = express.Router();
const { authMiddWare, isAdmin } = require('../middleware/authMiddWare');
const { createColor, updateColor, getColor, getallColor, deleteColor } = require('../controller/colorCtrl');

router.post("/", authMiddWare, isAdmin, createColor);
router.put("/:id", authMiddWare, isAdmin, updateColor);
router.get("/:id", getColor);
router.get("/", getallColor);
router.delete("/:id", authMiddWare, isAdmin, deleteColor);


module.exports = router;