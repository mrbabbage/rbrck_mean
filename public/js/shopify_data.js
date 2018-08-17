const  express             = require('express'),
           request            = require('request-promise'),
           bodyParser      =require("body-parser"),
           mongoose       =require("mongoose");

var   Ordersdb = require("../../models/ordersdb"),
        Ordersmin=require("../../models/ordersmin"),
        Productsdb= require("../../models/productsdb"),
        Orders= require("../../models/orders");

module.exports = {
  getOrders: function (key,pass) {
          var page="https://"+key+":"+pass+"@alyom.myshopify.com/admin/orders.json";
          var orders=[];
          var orders_length;
              request(page, function(error,response,body){
                 if (!error && response.statusCode==200){
                     // Ordersdb.remove({}, function(err) {
                     //     console.log('Ordersdb collection removed')
                     // });
                     Ordersmin.remove({}, function(err) {
                         console.log('Ordersmin collection removed')
                     });
                     orders=JSON.parse(body);
                     orders=orders.orders;
                     // ============================
                         orders_length=orders.length
                         for (var i=0;i<orders_length;i++){
                                // Ordersdb.create(orders[i],function(err,item){
                                //     if(err){
                                //         console.log(err);
                                //     }
                                // });

                                ////////////////////////////////////////////

                                var query = {id: orders[i].id},
                                    update=orders[i],
                                    options = { upsert: true, new: true, setDefaultsOnInsert: true };

                                // Find the document
                                Ordersdb.findOneAndUpdate(query, update, options, function(err, result) {
                                    if (err) {
                                        return;
                                    }
                                    // do something with the document
                                });

                                ///////////////////////////////////////////

                                // ORDER ID
                                order_id= orders[i].id
                                 // DATE INFO
                                 year=orders[i].created_at.slice(0, 4);
                                 month=orders[i].created_at.slice(5, 7);
                                 day=orders[i].created_at.slice(8, 10);
                                 order_date=day+"-"+month+"-"+year;
                                 //  ORDER #
                                 order_number="1"+day+month+year+orders[i].name.slice(1);
                                 //  # of items
                                 order_items_number=orders[i].line_items.length
                                 // Shipping address
                                 customer_address=orders[i].shipping_address.address1+" "+orders[i].shipping_address.address2;
                                 //  Customer ID
                                 customer_id=orders[i].customer.id;
                                 //  Fulfillment Status
                                 order_fulfillment=orders[i].fulfillment_status;

                                 products=[];
                                 quantity=[];

                                 shipping_address={};

                                 shipping=orders[i].shipping_address;

                                 for (var j=0;j<order_items_number;j++){
                                    products.push(orders[i].line_items[j].product_id);
                                    quantity.push(orders[i].line_items[j].quantity);
                                 }

                                 Ordersmin.create({
                                     order_id: order_id,
                                     order_date: order_date,
                                     order_number: order_number,
                                     order_items_number: order_items_number,
                                     customer_address: customer_address,
                                     customer_id: customer_id,
                                     order_fulfillment: order_fulfillment,
                                     products: products,
                                     quantity: quantity,
                                     shipping_address: {
                                         first_name: shipping.first_name,
                                         address1: shipping.address1,
                                         phone: shipping.phone,
                                         city: shipping.city,
                                         zip: shipping.zip,
                                         province:shipping.province,
                                         country: shipping.country,
                                         last_name: shipping.last_name,
                                         address2: shipping.address2,
                                         company: shipping.company,
                                         latitude: shipping.latitude,
                                         longitude: shipping.longtitude,
                                         name: shipping.name,
                                         country_code: shipping.country_code,
                                         province_code: shipping.province_code,
                                     }
                                 }, function(err,item){
                                     if(err){
                                         console.log(err);
                                     }
                                     });

                         };
                 }
                 else {console.log(error);}
             });

  },
  getProducts: function (key,pass) {
      var page="https://"+key+":"+pass+"@alyom.myshopify.com/admin/products.json";
      var products=[];
      var products_length;
      request(page, function(error,response,body){
         if (!error && response.statusCode==200){
             Productsdb.remove({}, function(err) {
                 console.log('Productsdb collection removed')
             });
             products=JSON.parse(body);
             products=products.products;
             // ============================
                 products_length=products.length;
                 for (var i=0;i<products_length;i++){
                        Productsdb.create(products[i],function(err,item){
                            if(err){
                                console.log(err);
                            }
                        });
////////////////////////////////////////////////////////////////////////NOT WORKING
                        // var query = {id: products[i].id},
                        //     update = {},
                        //     options = { upsert: true, new: true, setDefaultsOnInsert: true };
                        //
                        // // Find the document
                        // Productsdb.findOneAndUpdate(query, update, options, function(err, result) {
                        //     if (err) {
                        //         return;
                        //     }
                        // });
////////////////////////////////////////////////////////////////////////

                   };
         }
         else {console.log(error);}
      });
  },
  getOrders2: function (key,pass) {

              var page="https://"+key+":"+pass+"@alyom.myshopify.com/admin/orders.json";
              var orders_1=[];
              var orders_length;
                  request(page, function(error,response,body){
                     if (!error && response.statusCode==200){
                         orders_1=JSON.parse(body);
                         orders_1=orders_1.orders;
                         // ============================
                             orders_length=orders_1.length;

                             // Orders.remove({}, function(err) {
                             //     console.log('Orders collection removed')
                             // });

                             for (var i=0;i<orders_length;i++){
//////////
                                    var query = {id: orders_1[i].id},
                                        //update = {},
                                        update=orders_1[i],
                                        options = { upsert: true, new: true, setDefaultsOnInsert: true };

                                    // Find the document
                                    Ordersdb.findOneAndUpdate(query, update, options, function(err, result) {
                                        if (err) {
                                            return;
                                        }
                                    });


//=================== UPDATING
var query = {order_id: orders_1[i].id},
    update = {                         order_id: orders_1[i].id,
                                             //JSON DATA
                                             order: orders_1[i],
                                             // Packaged
                                             //packaged: false,
                                             // Delivered
                                             //delivered: false,
                                             // Fulfilled
                                             //fulfilled: false,
                                             //Edits
                                             //comments: []
                                         },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

// Find the document
Orders.findOneAndUpdate(query, update, options, function(err, result) {
    if (err) {
        return;
    }
});
//===================
                             };
                     }
                     else {console.log(error);}


//=================== SET
/*
Book.findOneAndUpdate({ "_id": bookId },
{
"$set": { "name": name, "genre": genre, "author": author, "similar": similar},
$push: { <field>: <value>},
}
).exec(function(err, book){
   if(err) {
       console.log(err);
       res.status(500).send(err);
   } else {
            res.status(200).send(book);
   }
});
*/
//===================

                     // var query = {order_id: 580501110841},
                     //     update = {                         order_id: 580501110841,
                     //                                              //JSON DATA
                     //                                              //order: orders_1[i],
                     //                                              // Packaged
                     //                                              packaged: true,
                     //                                              // Delivered
                     //                                              delivered: false,
                     //                                              // Fulfilled
                     //                                              fulfilled: false,
                     //                                              //Edits
                     //                                              comments: []
                     //                                          },
                     //     options = { upsert: true, new: true, setDefaultsOnInsert: true };
                     //
                     // // Find the document
                     // Orders.findOneAndUpdate(query, update, options, function(err, result) {
                     //     if (err) {
                     //         return;
                     //     }
                     // });



                     // Ordersdb.find({}, function(err,O){
                     //     console.log(O);
                     // });
                 });





  }
};
