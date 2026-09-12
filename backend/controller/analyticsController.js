const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");

const getAdminStats = async(req,res)=>{
    try{
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalUsers = await User.countDocuments({ role:'user'});

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

        res.json({totalRevenue, totalOrders, totalProducts, totalUsers});


    }catch(error){
        res.status(500).json({message:message.error});
    }
}

module.exports = {getAdminStats};