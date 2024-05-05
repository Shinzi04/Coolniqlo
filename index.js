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
app.use(express.json());
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
app.use("/admin/dashboard", require("./routes/dashboard/manageRoutes")); // route manage products
app.use("/admin/dashboard", require("./routes/dashboard/orderRoutes")); // route order products
app.use("/admin/dashboard", require("./routes/dashboard/salesRoutes")); // route sales products
app.use("/login", require("./routes/api/accountsRoutes"));
app.use("/verificationPage", require("./routes/api/verficationRouter"));
app.use("/editAccount", require("./routes/api/editRouter"));
app.use("/forgotPassword", require("./routes/api/forgotRouter"));
app.use(
  "/sendForgotPassword",
  require("./routes/api/sendForgotPasswordRouter")
);
app.use("/sendEmail", require("./routes/api/sendEmailRouter"));
app.use("/cart", require("./routes/api/cartRoutes"));
app.use("/purchaseHistory", require("./routes/api/purchaseHistoryRoutes"));
app.use("/changePicture", require("./routes/api/changePictureRouter"));
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
    req.session.emailStore = "";
    let products = await Product.find();
    console.log("profile picture (reload): ", req.session.profilePicture);
    res.render("index", {
      email: req.session.email,
      firstName: req.session.firstName,
      lastName: req.session.lastName,
      userID: req.session._id,
      profilePicture: req.session.profilePicture,
      products,
      title: "Coolniqlo",
      style: "css/style.css",
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/items", async (req, res) => {
  req.session.emailStore = "";
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    console.error(`Error fetching products:`, error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/userItems", async (req, res) => {
  const { itemId } = req.query;
  try {
    const product = await Product.findOne({ _id: itemId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch {
    console.error(`Error fetching specific product:`, error);
    res.status(500).send("Internal Server Error");
  }
});

// route untuk masing-masing detail product
app.get("/detail/:productID", async (req, res) => {
  req.session.emailStore = "";
  userID = req.session._id;
  try {
    let productID = req.params.productID;
    let productData = await Product.findOne({ id: productID });
    if (productData) {
      res.render("product-details", {
        productData,
        userID: userID,
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

// route untuk checkout
app.get("/checkout", (req, res) => {
  userID = req.session._id;
  userName = req.session_name;
  res.render("checkout", {
    title: "Checkout",
    style: "/../css/buy.css",
    email: req.session.email,
    userID: userID,
    userName: req.session.firstName + " " + req.session.lastName,
    userEmail: req.session.email,
  });
});

// route untuk logout
app.delete("/logout", (req, res, next) => {
  req.session.emailStore = "";
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

// not found route
app.get("*", (req, res) => {
  req.session.emailStore = "";
  res.status(404).render("notFound", {
    title: "404 Not Found - Coolniqlo",
    style: "/../css/notFound.css",
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}!`);
});
