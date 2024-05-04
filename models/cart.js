const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'account', // Reference to the User schema/model
        required: true,
    },
    productID: {
        type: Schema.Types.ObjectId,
        ref: 'ProductList', // Reference to the Product schema/model
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
});

module.exports = model("Cart", cartSchema);