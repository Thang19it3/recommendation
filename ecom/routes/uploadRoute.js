const express = require('express');
const {
    uploadImages,
    deleteImages
} = require('../controller/uploadCtrl');

const {isAdmin, authMiddWare} = require("../middleware/authMiddWare.js");
const {uploadPhoto, productImgResize} = require("../middleware/uploadImage")
const router = express.Router();




router.post("/", authMiddWare, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
router.delete("/delete-img/:id", authMiddWare, isAdmin, deleteImages);



module.exports = router;