// DATABASE TO STORE ALL ORDERS TO BE DISPLAYED ON THE SITE
// WITH FULFILLMENT STATUS

var mongoose=require("mongoose");

mongoose.connect("mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test");
var courier_ordersSchema=new mongoose.Schema({
    //Username
    username: String,
    //Active Orders
    active_orders: [Number],
    //Completed Orders
    completed_orders: [Number],
});

module.exports=mongoose.model("Courier_orders",courier_ordersSchema);
