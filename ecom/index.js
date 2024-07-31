const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const { notFound, errorHandle } = require("./middleware/errorHandle.js");
const cookieParser =require("cookie-parser");
const productRouter = require("./routes/productRoute");
const morgan = require('morgan');
const blogRouter = require("./routes/blogRoute.js");
const categoryRouter = require("./routes/categoryRouter");
const blogCat = require('./routes/blogCat');
const brandRoute = require('./routes/brandRoute');
const couponRoute = require('./routes/couponRoute');
const colorRoute = require('./routes/colorRoute');
const enqRoute = require('./routes/enqRoute');
const uploadRoute = require('./routes/uploadRoute');
const paymentRoute = require('./routes/paymentRoute.js');
const orderRoute = require('./routes/orderRoute.js');
const cors = require("cors");

dbConnect();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());



app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogCat);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRoute);
app.use("/api/enquiry", enqRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/order", orderRoute);

app.use(notFound);
app.use(errorHandle);

app.listen(PORT, ()=> {
    console.log(`Server is running PORT ${PORT}`);
});