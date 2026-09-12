const mongoose = require ("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb is connected successfully");
    }
    catch(error){
        console.error("mongodb connected failed",error.message);
        process.exit(1);
    }
};
module.exports = connectDB;