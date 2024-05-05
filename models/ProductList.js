const { Schema, model } = require("mongoose");

const ProductListSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: [Number],
    default: [],
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

ProductListSchema.virtual("rating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / this.ratings.length;
});

module.exports = model("products", ProductListSchema);
