/* ======================================
             SETUP
 ====================================== */
 const  express             = require('express'),
            app                  = express(),
            request            = require('request-promise'),
            bodyParser      =require("body-parser"),
            mongoose       =require("mongoose"),
            passport = require("passport"),
            localStrategy = require("passport-local"),
            passportLocalMongoose = require("passport-local-mongoose");

var   Ordersdb              = require("./models/ordersdb"),
        Ordersmin           = require("./models/ordersmin"),
        Productsdb          = require("./models/productsdb"),
        Orders                 = require("./models/orders"),
        Courier_orders    = require("./models/courier_orders"),
        Courier             = require("./models/courier");

// ***************************** MLAB *****************************
//let uri="mongodb://<dbuser>:<dbpassword>@ds243501.mlab.com:43501/proto_test"
// let uri="mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test";
// mongoose.connect(uri);
// ^^^^^^^^^^^^^^^^^^^ MLAB ^^^^^^^^^^^^^^^^^^^

mongoose.connect("mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(Courier.authenticate()));
passport.serializeUser(Courier.serializeUser());
passport.deserializeUser(Courier.deserializeUser());






var data = require('./public/js/shopify_data');

var   key     ="3b8175d563526d93ec1ad72e201afa59",
        pass   ="f45de04b4638d47ba6d8d32d220cbe48";

// ======== GETTING ORDERS
//data.getOrders(key,pass);

// ======== GETTING PRODUCTS
data.getProducts(key,pass);


app.get("/upload", function(req,res){

    res.render("upload");

});


/*========================================*/
// ===== Get : '/home'

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/pickup",
    failureRedirect: "/login"
}) , function(req,res){
    // console.log(req);
    // console.log(req.user.username);
});


//=======================

//Logout
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/login");
});

//
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//
// app.get("/secret", isLoggedIn ,function(req,res){
//     res.render("secret");
// });

////////////////////


app.get("/home", function(req,res){
    res.render("home");
});


// ####################################################### STORE
// ===== Get : '/orders2'
app.get("/orders", function(req,res){
    data.getOrders2(key,pass);
    Orders.find({}, function(err, allOrders){
        if (!err){
            res.render("orders_store", {orders: allOrders});
        }
    });
});
// ####################################################### ADMIN
app.get("/orders-admin", function(req,res){
    data.getOrders2(key,pass);
    Orders.find({}, function(err, allOrders){
        if (!err){
            res.render("orders2", {orders: allOrders});
        }
    });
});

// ####################################################### STORE
// ===== Get : '/inventory'
app.get("/inventory", function(req,res){

    data.getProducts(key,pass);
    Productsdb.find({}, function(err, allProducts){
        if (!err){
            res.render("inventory_store", {products: allProducts});
        }
    });
});

// ####################################################### ADMIN
// ===== Get : '/inventory'
app.get("/inventory-admin", function(req,res){

    data.getProducts(key,pass);
    Productsdb.find({}, function(err, allProducts){
        if (!err){
            res.render("inventory", {products: allProducts});
        }
    });
});
// ####################################################### COURIER
// ===== Get : '/PICKUP'
app.get("/pickup", isLoggedIn ,function(req,res){

    // console.log(req.user.username);
Courier_orders.find({username: req.user.username }, function(err, Courier_order){
    //console.log(Courier_order[0]);
    Orders.find({"assigned_to":req.user.username}, function(err, allOrders){
        if (!err){
            res.render("pickup", {orders: allOrders, courier_order: Courier_order});
        }
        else{
            console.log("PICK UP Error");
        }
    });
});

});
// ####################################################### COURIER
// ===== Get : '/DELIVERIES"
app.get("/deliveries", isLoggedIn ,function(req,res){

Courier_orders.find({username: req.user.username }, function(err, Courier_order){
    Orders.find({"packaged": true}, function(err, allOrders){
        if (!err){
            res.render("deliveries", {orders: allOrders, courier_order: Courier_order});
        }
        else{
            console.log("DELIVERY Error");
        }
    });
});
});
// ####################################################### COURIER
//+++++++++++++++++++++++++++++++++
app.get("/deliveries:id", isLoggedIn ,function(req,res){

    var id=Number(req.params.id);

    Orders.find({"order_id": id}, function(err, thisOrder){
        if (!err){
            res.render("deliveries_orderdetails", {order: thisOrder});
        }
    });

});
// ####################################################### COURIER
app.post("/deliveries:id", isLoggedIn ,function(req,res){


        var delivered = req.body.delivered;
        var id=Number(req.params.id);
        //console.log(req.body)

            if (delivered){
                    //////////////////////////////////////
                    Orders.findOneAndUpdate({order_id: id},
                        {
                        "$set": { "delivered": true},
                        }
                    ).exec(function(err, order){
                           if(!err) {
                               console.log("////////////////////");
                               console.log(order.delivered);
                           }
                        });
            }



            res.redirect("/deliveries")

});
// ####################################################### ADMIN
//+++++++++++++++++++++++++++++++++REGISTERY
// ===== Get : '/registery'
app.get("/registery", function(req,res){
    Courier.find({}, function(err, allCouriers){
        if (!err){
            console.log(allCouriers);
            res.render("registery", {courier:allCouriers});
        }
    });

});

app.post("/registery", function(req,res){
    Courier.register(new Courier({username: req.body.username}), req.body.password, function(err,courier){
        if(err){
            console.log(err);
            return res.render("registery");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/registery");
        });
    });
});
//+++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++
app.get("/pickup:id", isLoggedIn ,function(req,res){

    var id=Number(req.params.id);

    Orders.find({"order_id": id}, function(err, thisOrder){
        if (!err){
            Productsdb.find({}, function(err, allProducts){
                if (!err){
                            res.render("pickup_orderdetails", {order: thisOrder, products: allProducts});

                }
            });
        }
    });

});
//+++++++++++++++++++++++++++++++++
app.post("/pickup:id", isLoggedIn ,function(req,res){


        var packaged = req.body.packaged;
        var comment=req.body.order_comment;
        var id=Number(req.params.id);
        //console.log(req.body)

            if (packaged){
                    //////////////////////////////////////
                    Orders.findOneAndUpdate({order_id: id},
                        {
                        "$set": { "packaged": true},
                        }
                    ).exec(function(err, order){
                           if(!err) {
                               console.log("////////////////////");
                               console.log(order.packaged);
                           }
                        });
            }

        if(comment){
            Orders.findOneAndUpdate({order_id: id},
                {
                "$push": { "comments": comment},
                }
            ).exec(function(err, order){
                   if(!err) {
                       console.log("////////////////////");
                       console.log(comment);
                   }
                });
        }



            res.redirect("/pickup"+id)

});
//+++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++
// ####################################################### ADMIN
app.get("/admin:id", function(req,res){

    var id=Number(req.params.id);

    Orders.find({"order_id": id}, function(err, thisOrder){
        if (!err){
            Productsdb.find({}, function(err, allProducts){
                if (!err){
                    Courier.find({}, function(err, allCouriers){
                        if (!err){
                            res.render("orderdetails2", {order: thisOrder, products: allProducts, couriers: allCouriers});
                        }});
                }
            });
        }
    });

});

// ####################################################### ADMIN
app.post("/admin:id", function(req,res){
    var choice = req.body.courier_select;
    var comment=req.body.order_comment;
    var fulfilled=req.body.fulfillment;
    var id=Number(req.params.id);

    //console.log(req.body)

if(choice){
    Orders.find({order_id: id}, function(err, thisOrder){
        if (thisOrder.assigned!=true){
            //////////////////////////////////////
            Courier_orders.findOneAndUpdate({username: choice},
                {
                "$push": { "active_orders": Number(req.params.id)},
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
            ).exec(function(err, thisCourierOrder){
                   if(err) {
                       console.log(err);
                   }
                });
                //////////////////////////////////////
                Orders.findOneAndUpdate({order_id: id},
                    {
                    "$set": { "assigned": true, "assigned_to": choice},
                    }
                ).exec(function(err, order){
                       if(!err) {
                           console.log("//////////ASSIGNED TO//////////");
                           console.log(order.assigned_to);
                       }
                    });
        }
    });
}
    if(comment){
        Orders.findOneAndUpdate({order_id: id},
            {
            "$push": { "comments": comment},
            }
        ).exec(function(err, order){
               if(!err) {
                   //console.log("////////////////////");
                   //console.log(comment);
               }
            });
    }

    if(fulfilled){
        Orders.findOneAndUpdate({order_id: id},
            {
            "$set": { "fulfilled": true},
            }
        ).exec(function(err, order){
               if(!err) {
                   //console.log("////////////////////");
                   //console.log(comment);
               }
            });

            Courier_orders.findOneAndUpdate({username: choice},
                {
                "$pull": { "active_orders": Number(req.params.id)},
                "$push": { "completed_orders": Number(req.params.id)},
            },
            { upsert: false, new: true, setDefaultsOnInsert: true },
            ).exec(function(err, thisCourierOrder){
                   if(err) {
                       console.log(err);
                   }
                });
    }



        res.redirect("/admin"+id)
});

// ####################################################### STORE
app.get("/:id", function(req,res){

    var id=Number(req.params.id);

    Orders.find({"order_id": id}, function(err, thisOrder){
        if (!err){
            Productsdb.find({}, function(err, allProducts){
                if (!err){
                    Courier.find({}, function(err, allCouriers){
                        if (!err){
                            res.render("orderdetails_store", {order: thisOrder, products: allProducts, couriers: allCouriers});
                        }});
                }
            });
        }
    });

});

// ####################################################### STORE
app.post("/:id", function(req,res){
    var packaged=req.body.packaged;
    var id=Number(req.params.id);

    //console.log(req.body)


    if(packaged){
        Orders.findOneAndUpdate({order_id: id},
            {
            "$set": { "packaged": true},
            }
        ).exec(function(err, order){
               if(!err) {
                   //console.log("////////////////////");
                   //console.log(comment);
               }
            });
    }



        res.redirect("/"+id)
});

// ===== Get : '/dORDERNO.'




// ===== Listen : PORT 3000 [Start Server]

app.listen(3000, function(){
    // if(!err){
        console.log("Server has started...");
    // }
    // else{console.log(err);}
});


// TESTING THIS THING OUT
