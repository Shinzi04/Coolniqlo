const { Router } = require("express");
const router = Router();
const ProductList = require("../../models/productList");

// method get
router.get("/", async (req, res) => {
  try {
    const items = await ProductList.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// method post
router.post("/", async (req, res) => {
  try {
    const newProductList = new ProductList(req.body);
    const savedProductList = await newProductList.save();
    if (!savedProductList) {
      res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(savedProductList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// method put
router.put("/:id", async (req, res) => {
  try {
    const updatedProductList = await ProductList.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProductList) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedProductList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
