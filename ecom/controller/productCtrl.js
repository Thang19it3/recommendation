const Product = require("../models/productModel");
const User = require("../models/useModel");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMoogoBnId = require("../utils/validateMooge");
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary.js');
const fs = require('fs')
const csv = require('csvtojson')
const CsvParser = require('json2csv').Parser

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//update
const updateProduct = asyncHandler(async (req, res) => {
    const {id}  = req?.params;
    try {
        /*if(req.body.title)
        {
            req.body.slug = slugify(req.body.title);
        }  */ 
        const updatePro = await Product.findByIdAndUpdate(id, {
            title: req?.body?.title,
            description: req?.body?.description,
            price: req?.body?.price,
            category: req?.body?.category,
            //slug: slugify(req.body.title),
            tags: req?.body?.tags,
            isSale: req?.body?.isSale,
            timeSale: req?.body?.timeSale,
            isDiscount: req?.body?.isDiscount,
        }, 
        {
            new: true
        });
        res.json(updatePro);
    } catch (error) {
        throw new Error(error);
    }
});

//delete
const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct); 
    } catch (error) {
        throw new Error(error);
    }
})

//getaProduct
const getaProduct = asyncHandler( async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id).populate("color");
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//getall
const getAllProduct = asyncHandler(async (req, res) => {
    console.log(req.query);
    try {
        // Filtering
        const queryObj = {
          ...req.query
        };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }
        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const getallPro = asyncHandler(async (req, res) => {
  try {
    const getallPro = await Product.find();
    res.json(getallPro);
  } catch (error) {
    throw new Error(error);
  }
});
/// error
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyAdded = user.wishlist.includes(prodId);
    if (alreadyAdded) {
      user.wishlist = user.wishlist.filter((id) => id !== prodId);
      user.wishlist.pull(prodId);
    } else {
      user.wishlist.push(prodId);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );    
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings?.ratings.length;
    let ratingsum = getallratings?.ratings
      .map((item) => item?.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});


const exportPro = asyncHandler (async (req, res)=> {
  try {
    let prods = []
    var proData = await Product.find({});

    proData.forEach((prod)=>{
      const {_id,title} = prod;
      if (prod.ratings && prod.ratings.length > 0 ){
      prod.ratings.forEach((rating)=>{
        const {star,postedby} = rating;
        prods.push({id:_id,postedby: postedby,star: star});
      })
      } else 
      {
        prods.push({id:_id});
      }
    });
  
    const csvFields = ['id  ', 'userId', 'rating'];
    const csvParser = new CsvParser({csvFields})
    const csvData = csvParser.parse(prods)

    const filePath = 'C:/Users/HOME-SINGLE/Desktop/python/recomen/data/rating.csv';

    fs.writeFileSync(filePath, '\uFEFF' + csvData, 'utf8');


    
    res.status(200).end(csvData);
  } catch (error) {
    throw new Error(error);
  }
})

const exportProTitle = asyncHandler (async (req, res)=> {
  try {
    let prods = []
    var proData = await Product.find({});

    proData.forEach((prod)=>{
      const {id: _id,brand: brand, title: title} = prod;
        prods.push({id: _id,brand: brand, title: title});
    });
  
    const csvFields = ['id','brand','productId'];
    const csvParser = new CsvParser({csvFields})
    const csvData = csvParser.parse(prods)

    const filePath = 'C:/Users/HOME-SINGLE/Desktop/python/recomen/data/product.csv';

    fs.writeFileSync(filePath, '\uFEFF' + csvData, 'utf8');


    
    res.status(200).end(csvData);
  } catch (error) {
    throw new Error(error);
  }
})

const getallPro3 = asyncHandler(async (req, res) => {
  try {
    const getallProData = await Product.find(); // Lấy dữ liệu từ MongoDB

    // Tạo mảng items chỉ chứa các tiêu đề
    const itemsArray = getallProData.map(product => product.title);

    // Chuyển đổi dữ liệu thành chuỗi JSON
    const jsonData = {
      products: getallProData, // Gán dữ liệu từ MongoDB vào mảng products
      items: itemsArray // Gán mảng items với các tiêu đề
    };

    // Chuyển đổi dữ liệu thành chuỗi JSON
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Đường dẫn đến tệp tin JSON
    const filePath = 'C:\\Users\\HOME-SINGLE\\Desktop\\python\\python_chatbot\\item3.json';

    // Ghi dữ liệu vào tệp tin JSON
    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        throw new Error(err);
      }
      console.log(`Dữ liệu đã được ghi vào tệp tin ${filePath}`);
      res.json(getallProData); // Trả về dữ liệu như ban đầu trong response
    });
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    exportPro,
    exportProTitle,
    getallPro,
    getallPro3
};