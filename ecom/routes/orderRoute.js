const express = require('express');
const router = express.Router();
const {
    authMiddWare,
    isAdmin
} = require('../middleware/authMiddWare');
const {
    updateOrder,
    getallOrder
} = require('../controller/orderCtrl');


router.put("/:id", authMiddWare, updateOrder);
router.get("/:id", getallOrder);
router.get("/", getallOrder);



module.exports = router;