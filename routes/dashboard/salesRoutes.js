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

    // total kuantitas produk berdasarkan ID produk
    const totalQuantities = await purchaseHistory.aggregate([
      {
        $group: {
          _id: "$productID",
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // membuat map untuk menyimpan total kuantitas setiap produk
    const totalQuantitiesMap = new Map();
    totalQuantities.forEach((item) => {
      totalQuantitiesMap.set(item._id.toString(), item.totalQuantity);
    });

    // query semua produk
    let products = await Product.find();

    // mengambil total kuantitas produk setiap produk dan menyimpan pada totalQuantity
    products.forEach((product) => {
      const totalQuantity = totalQuantitiesMap.get(product._id.toString()) || 0;
      product.totalQuantity = totalQuantity;
    });

    // sortir total kuantitas produk
    products.sort((a, b) => b.totalQuantity - a.totalQuantity);

    // pagination setelah sorting
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    products = products.slice(skip, skip + limit);

    res.render("dashboard/sales", {
      products,
      title: "Sales - Coolniqlo",
      style: "../../css/dashboard.css",
      currentPage: page,
      totalPages,
      activePage: "sales",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
