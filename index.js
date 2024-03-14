const express = require("express");
const app = express();
const ejs = require("ejs");
const fs = require("fs");
const products = JSON.parse(fs.readFileSync("products.json", "utf8"));
const port = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/detail/:productID", (req, res) => {
  const productID = req.params.productID;
  const productData = products[productID];
  if (productData) {
    res.render("product-details", { productData });
  } else {
    res.send("Product does not exist!");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}!`);
});
