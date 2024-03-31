if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
const passport = require("passport");
const users = [];
const flash = require("express-flash");
const session = require("express-session");
const internal = require("stream");

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log(`Database connected ${process.env.MONGO_URL}`),
  (err) => console.log(err)
);
const Product = require("./models/productList");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method_logout"));
app.use(express.static("public"));
app.use(morgan("dev"));
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
    res.render("index", { products, title: "Coolniqlo", style: "css/style.css" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
  
});

app.get("/items", async(req,res) =>{
  try{
    const products = await Product.find();
    res.json(products)
  }catch{
    console.error(`Error fetching products:`,error);
    res.status(500).send("Internal Server Error");
  }

})

// route untuk masing-masing detail product
app.get("/detail/:productID", async (req, res) => {
  try {
    let productID = req.params.productID;
    let productData = await Product.findOne({ id: productID });
    if (productData) {
      res.render("product-details", {
        productData,
        title: productData.name + " - Coolniqlo",
        style: "../css/buy.css",
      });
    } else {
      res.status(404).render("notFound", {
        title: "Not Found 404 - Coolniqlo",
        style: "/../css/notFound.css",
      });
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

// route untuk ke page register dan dicek apakah sudah pernah login atau belum
// kalau sudah login tidak akan bisa kembali lagi ke page register
app.post("/login", checkNotAuthenticated, async (req, res) => {
  if (req.body.signIn == "1") {
    // Proses login
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res);
  } else if (req.body.signUp == "0") {
    // Proses registrasi
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      });
      res.redirect("/login");
    } catch {
      res.redirect("/login");
    }
  } else {
    res.status(400).send("Bad Request");
  }
});

// route untuk logout
app.delete("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// fungsi untuk mengecek apakah user sudah login atau belum, jika belum, maka akan redirect ke login
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// fungsi untuk mengecek apakah user sudah login atau belum, jika sudah, maka akan redirect ke homepage
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// route untuk pindah ke page notFound bila url tidak ditemukan
app.get("*", (req, res) => {
  res.status(404).render("notFound", {
    title: "404 Not Found - Coolniqlo",
    style: "/../css/notFound.css",
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
