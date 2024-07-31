const { generateToken } = require("../config/jwtToken.js");
const User = require("../models/useModel.js");
const asyncHandle = require("express-async-handler");
const validateMoogoBnId = require("../utils/validateMooge.js");
const {generateRefreshToken} = require("../config/refreshToken.js");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel.js");
const Cart = require('../models/cartModel');
const Coupon = require("../models/couponModel.js");
const Order = require("../models/orderModel.js");
var uniqid = require("uniqid");
const fs = require('fs')
const csv = require('csvtojson')
const CsvParser = require('json2csv').Parser

//register

const createUser = asyncHandle(
    async (req, res) => {
        const email = req.body.email;
        const findUser = await User.findOne({
            email: email
        });
        if (!findUser) {
            // create user
            const newUser = User.create(req.body);
            res.json(newUser);
        } else {
            throw new Error("User Already Exits");
        }
    }
);

//login

const loginUser = asyncHandle(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      district: findUser?.district,
      ward: findUser?.ward,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

/// admin 
const loginAdmin = asyncHandle(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      district: findAdmin?.district,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

/// brand
const loginBrand = asyncHandle(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findBrand = await User.findOne({ email });
  if (findBrand.role !== "brand") throw new Error("Not Authorised");
  if (findBrand && (await findBrand.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findBrand?._id);
    const updateuser = await User.findByIdAndUpdate(
      findBrand.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findBrand?._id,
      firstname: findBrand?.firstname,
      lastname: findBrand?.lastname,
      email: findBrand?.email,
      mobile: findBrand?.mobile,
      district: findBrand?.district,
      token: generateToken(findBrand?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//handle refresh
const handleRefreshToken = asyncHandle(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//update 
const updateUser = asyncHandle(async (req, res) => {
    const { _id } = req.user;
    validateMoogoBnId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        });
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
})

//log out 
const logout = asyncHandle(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({_id: user._id}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// get all user

const getAllUser = asyncHandle(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

const updateRoleUser = asyncHandle(async (req,res)=> {
   const {
     id
   } = req.params;
   try {
    const updateRoleUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateRoleUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    res.json(updateRoleUser);
   } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(error);
   }
})

// get single user

const getaUser = asyncHandle(async (req, res) => {
    const { id } = req.params;
    validateMoogoBnId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});

// delete single user
const deleteUser = asyncHandle(async (req, res) => {
    const {
        id
    } = req.params;
    validateMoogoBnId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const blockUser = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMoogoBnId(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockUser);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMoogoBnId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandle (async (req, res) => {
  const { _id } =req.user;
  const {password} = req.body;
  validateMoogoBnId(_id);
  const user = await User.findById(_id);
  if (password)
  {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else 
  {
    res.json(user);
  }
});


const getWishList = asyncHandle(async (req, res) => {
  const { _id } =req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

// save adress
const saveAdress = asyncHandle(async (req, res, next)=>{
  const { _id } = req.user;
  validateMoogoBnId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandle(async (req, res)=>{
  const { productId, color, quantity, price } = req.body;
  const { _id } = req.user;
  validateMoogoBnId(_id);
  try {
    
    let newCart = await new Cart({
      userId:_id,
      productId,
      quantity,
      color,
      price,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandle(async (req, res)=>{
  const {_id}= req.user;
  validateMoogoBnId(_id);
  try {
    const cart = await Cart.find({ userId: _id}).populate("productId").populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProductFormCart = asyncHandle(async(req, res) => {
  const {_id}= req.user;
  const {cartItemId} = req.params;
  validateMoogoBnId(_id);

  try {
    const deleteProductFormCart = await Cart.deleteOne({userId:_id,_id:cartItemId})
    res.json(deleteProductFormCart);
  } catch (error) {
    throw new Error(error);
  }


});

const updateProductFormCart = asyncHandle(async(req, res)=>{
  const {_id}= req.user;
  const {cartItemId, newQuantity} = req.params;
  validateMoogoBnId(_id);

  try {
    const cartItem = await Cart.findOne({userId:_id,_id:cartItemId})
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandle(async(req, res)=>{
  const {orderItems, paiAt, totalPrice, totalPriceAfterDiscount,payment} = req.body;
  const {_id} = req.user;
  try {
    const order = await Order.create({
      orderItems, paiAt, totalPrice, totalPriceAfterDiscount, user: _id, payment
    })
    res.json({
      order,
      success:true
    })
  } catch (error) {
    throw new Error(error);
  }
})

const getMyOrders = asyncHandle(async (req,res)=> {
  const {_id} = req.user;
  try {
    const orders =await Order.find({ user: _id}).populate("user").populate("orderItems.product").populate("orderItems.color")
    res.json({orders});
  } catch (error) {
    throw new Error(error);
  }
})

const getMonthWiseOrderIncome = asyncHandle(async (req, res) => {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  let d = new Date()
  let endDate = ""
  d.setDate(1)
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth()-1)
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear()
    
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $get: new Date(endDate)
        }
      }
    }, {
      $group: {
        _id: {
          month: "$month"
        },
        amount: {
          $sum: "$totalPriceAfterDiscount"
        }
      }
    }
  ])
  res.json(data)
})

const getMonthWiseOrderCount = asyncHandle(async (req, res) => {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  let d = new Date()
  let endDate = ""
  d.setDate(1)
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1)
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear()

  }
  const data = await Order.aggregate([{
    $match: {
      createdAt: {
        $lte: new Date(),
        $get: new Date(endDate)
      }
    }
  }, {
    $group: {
      _id: {
        month: "$month"
      },
      count: {
        $sum: 1
      }
    }
  }])
  res.json(data)
})

const getYearlyTotalOrders = asyncHandle(async (req, res) => {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  let d = new Date()
  let endDate = ""
  d.setDate(1)
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1)
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear()

  }
  const data = await Order.aggregate([{
    $match: {
      createdAt: {
        $lte: new Date(),
        $get: new Date(endDate)
      }
    }
  }, {
    $group: {
      _id: null,
      count: {
        $sum: 1
      },
       amount: {
        $sum: "$totalPriceAfterDiscount"
       }
    }
  }])
  res.json(data)
})

const exportUserTitle = asyncHandle (async (req, res)=> {
  try {
    let prods = []
    var proData = await User.find({});

    proData.forEach((prod)=>{
      const {_id,firstname, lastname, email} = prod;
        prods.push({_id,firstname, lastname, email});
    });
  
    const csvFields = ['id','firstname','lastname','email'];
    const csvParser = new CsvParser({csvFields})
    const csvData = csvParser.parse(prods)

    const filePath = 'C:/Users/HOME-SINGLE/Desktop/python/recomen/data/user.csv';

    fs.writeFileSync(filePath, '\uFEFF' + csvData, 'utf8');


    
    res.status(200).end(csvData);
  } catch (error) {
    throw new Error(error);
  }
});

const forgotPasswordToken = asyncHandle(async (req, res) => {
  const {
    email
  } = req.body;
  const user = await User.findOne({
    email
  });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandle(async (req, res) => {
  const {
    password
  } = req.body;
  const {
    token
  } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
    },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});


module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    loginAdmin,
    getWishList,
    saveAdress,
    userCart,
    getUserCart,
    removeProductFormCart,
    updateProductFormCart,
    createOrder,
    getMyOrders,
    getMonthWiseOrderIncome,
    getMonthWiseOrderCount,
    getYearlyTotalOrders,
    updateRoleUser,
    loginBrand,
    exportUserTitle,
    forgotPasswordToken
};