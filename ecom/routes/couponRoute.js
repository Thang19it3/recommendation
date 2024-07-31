const express = require('express');
const router = express.Router();
const { authMiddWare, isAdmin } = require('../middleware/authMiddWare'); 
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controller/couponCtrl');

router.post('/', authMiddWare, isAdmin, createCoupon);
router.get('/', getAllCoupon);
router.put('/:id', authMiddWare, isAdmin, updateCoupon);
router.delete('/:id', authMiddWare, isAdmin, deleteCoupon);

module.exports = router;