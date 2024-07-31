const express = require('express');
const router = express.Router();
const {
    authMiddWare,
    isAdmin
} = require('../middleware/authMiddWare');
const {
    createEnquiry,
    updateEnquiry,
    getEnquiry,
    getallEnquiry,
    deleteEnquiry
} = require('../controller/enqCtrl');

router.post("/", createEnquiry);
router.put("/:id", authMiddWare, isAdmin, updateEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);
router.delete("/:id", authMiddWare, isAdmin, deleteEnquiry);


module.exports = router;