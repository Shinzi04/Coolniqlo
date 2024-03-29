const { Schema, model } = require("mongoose");

const ProductListSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bigImage: {
    type: String,
    required: true,
  },
  smallImages: {
    type: [String],
    required: true,
  },
});

module.exports = model("products", ProductListSchema);