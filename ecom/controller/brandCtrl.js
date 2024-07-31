const Brand = require("../models/brandModel");
const User = require("../models/useModel");
const asyncHandler = require('express-async-handler');
const validateMoogoBnId = require("../utils/validateMooge");

const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMoogoBnId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body,
            {
                new: true,
            });
        res.json(updateBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getBrand = await Brand.findById(id);
        const updateView = await Brand.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1},
            },
            {
                new: true,
            });
        res.json({getBrand});
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getAllBrand = await Brand.find().populate("userId");
        res.json(getAllBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json(deleteBrand);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createBrand,
    updateBrand,
    getBrand,
    getAllBrand,
    deleteBrand
};