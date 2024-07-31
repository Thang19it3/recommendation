const order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMooge");


const updateOrder = asyncHandler(async (req, res) => {
    const {
        id
    } = req.params;
    validateMongoDbId(id);
    try {
        const updatedEnquiry = await order.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

const getallOrder = asyncHandler(async (req, res) => {
    try {
        const getallOrder = await order.find();
        res.json(getallOrder);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    updateOrder,
    getallOrder,
};