var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

//mongoose.connect("mongodb://localhost/courierdb");

var CourierSchema = new mongoose.Schema({
    username: String,
    password: String,
});

CourierSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("Courier",CourierSchema);
