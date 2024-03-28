const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);
const Product = require("./models/productList");

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/products", require("./routes/api/productListRoutes"));
app.set("view engine", "ejs");

// route untuk homepage awal
app.get("/", (req, res) => {
  res.render("index");
});

// route untuk masing-masing detail product
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
