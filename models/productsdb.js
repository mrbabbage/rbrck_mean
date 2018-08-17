// DATABASE TO STORE ALL PRODUCTS ON THE SITE

//Connecting to MLAb to get products

var mongoose=require("mongoose");
mongoose.connect("mongodb://sandman:sandman2018@ds243501.mlab.com:43501/proto_test");
mongoose.connection.once('open',() => {
    console.log("connected to database");
})
var productsdbSchema=new mongoose.Schema({
    id: Number,
    title: String,
    body_html: String,
    vendor: String,
    product_type: String,
    created_at: String,
    handle: String,
    updated_at: String,
    published_at: String,
    template_suffix: String,
    tags: String,
    published_scope: String,
    variants: [
    {
    id: Number,
    product_id: Number,
    title: String,
    price: String,
    sku: String,
    position: Number,
    inventory_policy: String,
    compare_at_price: String,
    fulfillment_service: String,
    inventory_management: String,
    option1: String,
    option2: String,
    option3: String,
    created_at: String,
    updated_at: String,
    taxable: Boolean,
    barcode: String,
    grams: Number,
    image_id: String,
    inventory_quantity: Number,
    weight: Number,
    weight_unit: String,
    inventory_item_id: Number,
    old_inventory_quantity: Number,
    requires_shipping: Boolean,
    }],
    options: [
    {
    id: Number,
    product_id: Number,
    name: String,
    position: Number,
    values: [String]
    }
    ],
    images: [
    {
    id: Number,
    product_id: Number,
    position: Number,
    created_at: String,
    updated_at: String,
    alt: String,
    width: Number,
    height: Number,
    src: String,
    variant_ids: [ Number]
    }
    ],
    image: {
    id: Number,
    product_id: Number,
    position: Number,
    created_at: String,
    updated_at: String,
    alt: String,
    width: Number,
    height: Number,
    src: String,
    variant_ids: [Number ]
    }
});
module.exports=mongoose.model("Product",productsdbSchema);
