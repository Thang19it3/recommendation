const { mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Succe");
    } catch (error) {
        console.log("Eroor");
    }
};

module.exports = dbConnect;