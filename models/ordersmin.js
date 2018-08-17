// // DATABASE TO STORE ALL ORDERS TO BE DISPLAYED ON THE SITE
//
// var mongoose=require("mongoose");
//
// mongoose.connect("mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test");
// var ordersminSchema=new mongoose.Schema({
//     //ORDER ID
//     order_id: Number,
//     // DATE INFO
//     order_date: String,
//     //  ORDER #
//     order_number: String,
//     //  # of items
//     order_items_number: Number,
//     // Shipping address
//     customer_address: String,
//     //  Customer ID
//     customer_id: Number,
//     //  Order Fulfillment
//     order_fulfillment: String,
//     // Products
//     products:[Number],
//     //Quantity of product
//     quantity:[Number],
//
//     shipping_address: {
//         first_name: String,
//         address1: String,
//         phone: String,
//         city: String,
//         zip: String,
//         province:String,
//         country: String,
//         last_name: String,
//         address2: String,
//         company: String,
//         latitude: Number,
//         longitude: Number,
//         name: String,
//         country_code: String,
//         province_code: String
//     }
// });
//
// module.exports=mongoose.model("Ordersmin",ordersminSchema);
