const Coupon = require("../models/couponModel");
const asynHandler = require("express-async-handler");
const validateMoogoBnId = require("../utils/validateMooge");

const createCoupon = asynHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCoupon = asynHandler(async (req, res) => {
    try {
        const coupon = await Coupon.find();
        res.json(coupon);
    } catch (error) {
        throw new Error(error)
    }
});

const updateCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMoogoBnId(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const deleteCoupon = asynHandler(async (req, res) => {
    const {
        id
    } = req.params;
    validateMoogoBnId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon);
    } catch (error) {
        throw new Error(error)
    }
});


module.exports = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon
};