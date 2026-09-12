const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    category:{type:String, required:true},
    stock:{type:Number, required:true},
    imageUrl:{type:String, required:true},
    rating:{type:Number, default:0},
    numReviews:{type:Number, default:0}
},{timestamps:true});

module.exports = mongoose.model('Product', ProductSchema);