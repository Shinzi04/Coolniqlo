const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
dotenv.config();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/products", require("./routes/api/product-list-method"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

const Product = require("./models/ProductList");
app.get("/detail/:productID", async (req, res) => {
  try {
    const productID = req.params.productID;
    const productData = await Product.findOne({ id: productID });
    if (productData) {
      res.render("product-details", { productData });
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
