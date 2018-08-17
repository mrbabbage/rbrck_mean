// DATABASE TO STORE ALL ORDERS TO BE DISPLAYED ON THE SITE
// WITH FULFILLMENT STATUS
var mongoose=require("mongoose");
//var Ordersdb = require("../models/ordersdb");

mongoose.connect("mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test");
var ordersSchema=new mongoose.Schema({
    //ORDER ID
    order_id: Number,
    // ORDER
    order: {type: Object, ref: 'Ordersdb'},
    //Packaged & Paid
    packaged: Boolean,
    // Delivered
    delivered: Boolean,
    // Fulfilled
    fulfilled: Boolean,
    //Assigned
    assigned: Boolean,
    //Assigned to Courier Username
    assigned_to: String,
    //Edits
    comments: [String],
});

module.exports=mongoose.model("Order",ordersSchema);
