const mongoose = require('mongoose'); // Erase if already required
const getDate = () => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    return date + "/" + month + "/" + year;
};
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:false,
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/428/428933.png",
    },
    password:{
        type:String,
        required:true,
    },
    createdAt: {
        type: String,
        default: getDate(),
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "brand", "admin"],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart:{
        type: Array,
        default: [],
    },
    province: {
        type: String,
    },
    ward: {
        type: String,
    },
    district: {
        type: String, 
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, 
{
    timestamps: false,
});

userSchema.pre("save", async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function (enteredPassword)
{
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
    return resetToken; 
}

//Export the model
module.exports = mongoose.model('User', userSchema);