const { Router } = require("express");
const router = Router();
const Product = require("../../models/productList");
const Account = require("../../models/account");

// method get (READ) untuk mendapatkan list produk
router.get("/sales", isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    res.render("dashboard/sales", {
      products,
      email: req.session.email,
      title: "Sales - Coolniqlo",
      style: "../../css/dashboard.css",
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      activePage: "sales",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

function isAdmin(req, res, next) {
  const user = req.session.email;
  if (user === "admin@gmail.com") {
    return next();
  }
  res.redirect("/notFound");
}

module.exports = router;
