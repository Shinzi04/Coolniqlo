const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const searchItems = require("./custom_modules/search");
const internal = require("stream"); //

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
app.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("index", { products });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route untuk query search
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    let filteredItems = [];
    if (!query) {
      filteredItems = await Product.find();
    } else {
      filteredItems = await Product.find({
        name: { $regex: query, $options: "i" },
      });
    }
    res.render("index", { products: filteredItems, query });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


  const filteredItems = searchItems(items,query).slice(0,15);
  res.render('index', {products:filteredItems})

})


// route untuk masing-masing detail product
app.get("/detail/:productID", (req, res) => {
  const productID = req.params.productID;
  const productData = items.find(product => product.id === productID);
  if (productData) {
    res.render("product-details", { productData });
  } else {
    res.render('notFound');
  }

});

app.get('*', (req, res) => {
  res.render('notFound');
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
