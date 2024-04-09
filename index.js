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
const Password = require("./models/account");
// initializePassport (
//   passport,
//   (email) => users.find((user) => user.email === email),
//   (id) => users.find((user) => user.id === id)
// );

initializePassport(
  passport,
  async (email) => {
    // Menggunakan req.body.email untuk mencari pengguna dalam database
    const user = await Account.findOne({ email: email });
    return user; // Mengembalikan hasil pencarian dari database
  },
  async (id) => {
    // Menggunakan req.body.email untuk mencari pengguna dalam database
    const user = await Account.findById(id);
    return user; // Mengembalikan hasil pencarian dari database
  }
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
app.use("/login", require("./routes/api/accountsRoutes"));
app.use('/verificationPage',require('./routes/api/verficationRouter'))
app.use('/editAccount',require('./routes/api/editRouter'))
app.use('/forgotPassword',require('./routes/api/forgotRouter'))
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
    req.session.emailStore = '';

    let products = await Product.find();
    // console.log("bisa")
    res.render("index", {
      email: req.session.email,
      firstName: req.session.firstName,
      lastName: req.session.lastName,
      products,
      title: "Coolniqlo",
      style: "css/style.css",
    });
    
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route untuk query search
app.get("/search", async (req, res) => {
  req.session.emailStore = '';
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
app.get("/items", async (req, res) => {
  req.session.emailStore = '';
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    console.error(`Error fetching products:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// route untuk masing-masing detail product
app.get("/detail/:productID", async (req, res) => {
  req.session.emailStore = '';
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

// route untuk logout
app.delete("/logout", (req, res, next) => {
  req.session.emailStore = '';
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
  req.session.emailStore = '';
  res.status(404).render("notFound", {
    title: "404 Not Found - Coolniqlo",
    style: "/../css/notFound.css",
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
