const { Router } = require("express");
const router = Router();
const purchaseHistory = require("../../models/purchaseHistory");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/orders", isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalPurchaseHistories = await purchaseHistory.countDocuments();

    // query untuk purchaseHistory dengan referensi ke userID dan productID
    const purchaseHistories = await purchaseHistory
      .find()
      .populate("userID")
      .populate("productID")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.render("dashboard/orders", {
      purchaseHistories,
      title: "Order List - Coolniqlo",
      style: "../../css/dashboard.css",
      currentPage: page,
      totalPages: Math.ceil(totalPurchaseHistories / limit),
      activePage: "orders",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
