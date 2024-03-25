const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const searchItems = require('./custom_modules/search');
const internal = require('stream');
const items = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index' , {products:items.slice(0,15)});
});

app.get('/search' , (req,res) =>{
  const query = req.query.q;
  if(!query){
    res.render('index', {products:items.slice(0,15)});
    return;
  }

  const filteredItems = searchItems(items,query).slice(0,15);
  res.render('index', {products:filteredItems})

})

app.get("/detail/:productID", (req, res) => {
  const productID = req.params.productID;
  const productData = items.find(product => product.id === productID);
  if (productData) {
    res.render("product-details", { productData });
  } else {
    res.status(404).send("Product not found");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
