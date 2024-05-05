const { Schema, model } = require("mongoose");

const purchaseHistorySchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        required: true,
    },
    productID: {
        type: Schema.Types.ObjectId,
        ref: 'ProductList',
        required: true,
    },
    date: {
       type: Date, 
       default: Date.now,
    },
    quantity:{
        type: Number,
        required: true
    }
})

module.exports = model("purchaseHistory", purchaseHistorySchema)
