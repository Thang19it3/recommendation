const express = require('express');
const {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    exportPro,
    getallPro,
    exportProTitle,
    getallPro3
} = require('../controller/productCtrl');
const router = express.Router();
const {isAdmin,isBrand, authMiddWare} = require("../middleware/authMiddWare.js");


router.post("/", authMiddWare, isAdmin, createProduct);
router.post("/brand-add", authMiddWare, isBrand, createProduct);
router.get('/all-product', getallPro)
router.get('/export-product',  exportPro)
router.get('/export-product-title', exportProTitle)
router.get('/export-product-json', getallPro3)

router.get("/:id", getaProduct);

router.put("/wishlist", authMiddWare, addToWishlist);
router.put("/rating", authMiddWare, rating);
router.put("/:id", authMiddWare, isAdmin, updateProduct);
router.delete("/:id", authMiddWare, isAdmin, deleteProduct);

router.get("/", getAllProduct);


module.exports = router;