const User = require("../models/useModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddWare = asyncHandler( async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer"))
    {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error("not authorization");
        }
    } else 
    {
        throw new Error('There is no token');
    }
});

const isAdmin = asyncHandler( async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin")
    {
        throw new Error('not admin');
    } else 
    {
        next();
    }
})

const isBrand = asyncHandler(async (req, res, next) => {
    const {
        email
    } = req.user;
    const adminUser = await User.findOne({
        email
    });
    if (adminUser.role !== "brand") {
        throw new Error('not brand');
    } else {
        next();
    }
})


module.exports = { authMiddWare, isAdmin, isBrand };