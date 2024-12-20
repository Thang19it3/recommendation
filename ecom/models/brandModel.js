const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    images: [{
        public_id: String,
        url: String,
    }],
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model("Brand", brandSchema);