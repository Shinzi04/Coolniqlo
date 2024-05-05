const { Router } = require("express");
const router = Router();
const Product = require("../../models/productList");
const purchaseHistory = require("../../models/purchaseHistory");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/sales", isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const products = await Product.find()
      .sort({ sold: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments();
    res.render("dashboard/sales", {
      products,
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

module.exports = router;
