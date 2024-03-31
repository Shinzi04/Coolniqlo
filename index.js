const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const port = process.env.PORT || 5000;
const internal = require("stream");

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);
const Product = require("./models/productList");

app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/admin/dashboard", require("./routes/api/productListRoutes"));

app.set("view engine", "ejs");

// hapus trailing slash
app.use((req, res, next) => {
  if (req.path.slice(-1) === "/" && req.path.length > 1) {
    const safePath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safePath);
  } else {
    next();
  }
});

// route untuk homepage awal
app.get("/", async (req, res) => {
  try {
    let products = await Product.find();
    res.render("index", { products, title: "Coolniqlo", style: "style.css" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route untuk query search
app.get("/search", async (req, res) => {
  try {
    let query = req.query.q || "";
    // menghilangkan karakter khusus
    query = query.replace(/[^\w\s]/gi, "");
    let filteredItems = [];
    if (!query) {
      filteredItems = await Product.find();
    } else {
      filteredItems = await Product.find({
        name: { $regex: query, $options: "i" },
      });
    }
    res.render("index", {
      products: filteredItems,
      query,
      title: "Coolniqlo",
      style: "style.css",
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route untuk masing-masing detail product
app.get("/detail/:productID", async (req, res) => {
  try {
    let productID = req.params.productID;
    let productData = await Product.findOne({ id: productID });
    if (productData) {
      res.render("product-details", {
        productData,
        title: productData.name + " - Coolniqlo",
        style: "../buy.css",
      });
    } else {
      res.status(404).render("notFound", {
        title: "Not Found 404 - Coolniqlo",
        style: "/../notFound.css",
      });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route jika tidak ada page yang ada
app.get("*", (req, res) => {
  res.status(404).render("notFound", {
    title: "Not Found 404 - Coolniqlo",
    style: "/../notFound.css",
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
