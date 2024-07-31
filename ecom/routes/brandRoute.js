const express = require('express');
const router = express.Router();
const { authMiddWare, isAdmin } = require('../middleware/authMiddWare');
const { createBrand, updateBrand, getBrand, getAllBrand, deleteBrand } = require('../controller/brandCtrl');

router.post("/", authMiddWare, isAdmin, createBrand);
router.put("/:id", authMiddWare, isAdmin, updateBrand);
router.get("/:id", getBrand);
router.get("/", getAllBrand);
router.delete("/:id", authMiddWare, isAdmin, deleteBrand);


module.exports = router;