if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

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
const bcrypt = require("bcrypt");
const initializePassport = require('./passport-config');
const passport = require("passport");
const users = [];
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride("_method_logout"))
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/products", require("./routes/api/productListRoutes"));
app.set("view engine", "ejs");

// route untuk homepage awal
app.get("/", checkAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("index", { products });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route untuk query search
app.get("/search", checkAuthenticated, async (req, res) => {
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

// route untuk masing-masing detail product
app.get("/detail/:productID", checkAuthenticated,  async (req, res) => {
  try {
    const productID = req.params.productID;
    const productData = await Product.findOne({ id: productID });
    if (productData) {
      res.render("product-details", { productData });
    } else {
      res.render("notFound");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");                                                                           
  }
});

// route untuk ke page login dan dicek apakah sudah login atau belum
// kalau sudah login tidak bisa kembali ke page login
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

// 
app.post("/login",checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

// route untuk ke page register dan dicek apakah sudah pernah login atau belum
// kalau sudah login tidak akan bisa kembali lagi ke page register
app.get("/register", checkNotAuthenticated,  (req, res) => {
  res.render("register");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

// route untuk logout
app.delete('/logout', (req, res, next) => {
  req.logOut(function
  (err) {
      if (err) {
          return next(err);
      }
      res.redirect('/login');
  });
});
// fungsi untuk mengecek apakah user sudah login atau belum, jika belum, maka akan redirect ke login
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
}

// fungsi untuk mengecek apakah user sudah login atau belum, jika sudah, maka akan redirect ke homepage
function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return res.redirect('/');
  }
  next();
}

// route untuk pindah ke page notFound bila url tidak ditemukan
app.get("*", (req, res) => {
  res.render("notFound");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
