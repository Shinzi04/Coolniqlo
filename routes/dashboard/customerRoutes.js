const router = require("express").Router();
const Product = require("../../models/productList");
const PurchaseHistory = require("../../models/purchaseHistory"); // Corrected import
const isUser = require("../../middlewares/isUser");

router.get("/", isUser, async (req, res) => {
  try {
    const userID = req.session._id; 
    const purchaseHistories = await PurchaseHistory.find({
      userID,
      isRated: false,
    });
    const productIDs = purchaseHistories.map((history) => history.productID);

    // cari produk berdasarkan id dari produk id purchase history
    const products = await Product.find({ _id: { $in: productIDs } });

    res.render("customer-dashboard", { products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle rating submissions
router.post("/rate/:id", isUser, async (req, res) => {
  const productId = req.params.id;
  const { rating } = req.body;
  const userID = req.session._id;

  try {
    const purchaseHistory = await PurchaseHistory.findOne({
      userID,
      productID: productId,
      isRated: false,
    });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // push rating ke array
    product.ratings.push(rating);
    await product.save();

    // Update isRated menjadi true
    purchaseHistory.isRated = true;
    await purchaseHistory.save();

    res.redirect("/customer/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
