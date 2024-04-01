const { Router } = require("express");
const router = Router();
const Product = require("../../models/productList");
const Account = require("../../models/account");

// method get (READ)
router.get("/", isAdmin,async (req, res) => {
  try {
    const products = await Product.find();
    res.render("dashboard", {
      products,
      title: "Manage Products - Coolniqlo",
      style: "../dashboard.css",
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// method post (CREATE)
router.post("/add", async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ id: req.body.id });
    if (existingProduct) {
      return res.status(400).send("Product with this ID already exists");
    }
    const product = new Product(req.body);
    await product.save();
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// method put (UPDATE)
router.put("/edit/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      bigImage: req.body.bigImage,
      smallImages: req.body.smallImages.split("\n"),
    });
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// method delete (DELETE)
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
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
