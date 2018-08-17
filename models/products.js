// DATABASE TO STORE ALL ORDERS TO BE DISPLAYED ON THE SITE
// WITH FULFILLMENT STATUS
var mongoose=require("mongoose");
//var Ordersdb = require("../models/ordersdb");

// mongoose.connect("mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test");
var productsSchema=new mongoose.Schema({
    //Product ID
    product_id: Number,
    // Product Shopify Details
    product: {type: Object, ref: 'Productsdb'},
    //Assigned to Courier Username
    store_id: String,
    //Edits
    comments: [String],
});

module.exports=mongoose.model("Product",productsSchema);
