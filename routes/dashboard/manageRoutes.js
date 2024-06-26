const { Router } = require("express");
const router = Router();
const Product = require("../../models/productList");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const isAdmin = require("../../middlewares/isAdmin");

// konfigurasi multer untuk handling file yang di upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dir = `public/uploads/`;
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },

  // konfigurasi nama file
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);
    cb(null, `${originalName}-${Date.now()}${extension}`);
  },
});

// middleware filter mencegah upload file jika product ID sudah ada
const fileFilter = async (req, file, cb) => {
  const productId = req.body.id;
  const existingProduct = await Product.findOne({ id: productId });
  if (existingProduct) {
    return cb(new Error("Product with this ID already exists"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// redirect ke manage
router.get("/", isAdmin, (req, res) => {
  res.redirect("/admin/dashboard/manage");
});

router.get("/manage", isAdmin, async (req, res) => {
  try {
    // pagination limit 5 dokumen / data per halaman
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    res.render("dashboard/manage", {
      products,
      title: "Manage Products - Coolniqlo",
      style: "../../css/dashboard.css",
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      activePage: "manage",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// method post (CREATE) untuk menambahkan produk
router.post(
  "/manage/add",
  isAdmin,
  upload.fields([
    { name: "bigImage", maxCount: 1 },
    { name: "smallImages", maxCount: 8 },
  ]),
  async (req, res) => {
    try {
      // inisialisasi variabel untuk gambar yang di upload
      const bigImage = req.files["bigImage"][0];
      const smallImages = req.files["smallImages"];

      // membuat array path smallImages
      const smallImagePaths = await Promise.all(
        smallImages.map(async (smallImage) => {
          return `../uploads/${smallImage.filename}`;
        })
      );

      // mengurut array path smallImages secara ascending
      smallImagePaths.sort();

      // menyimpan data produk
      const product = new Product({
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        bigImage: `../uploads/${bigImage.filename}`,
        smallImages: smallImagePaths,
      });
      product.save();

      // redirect ke halaman dashboard setelah create
      const currentPage = req.body.currentPage || 1;
      res.redirect(`/admin/dashboard/manage?page=${currentPage}`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// method put (UPDATE) untuk perbarui produk
router.put(
  "/manage/edit/:id",
  isAdmin,
  upload.fields([
    { name: "bigImage", maxCount: 1 },
    { name: "smallImages", maxCount: 8 },
  ]),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      //  delete gambar sebelumnya jika upload gambar
      if (
        (req.files && req.files.bigImage) ||
        (req.files && req.files.smallImages)
      ) {
        const deleteImage = (filePath) => {
          try {
            const fullPath = path.join(
              __dirname,
              `../../public/uploads/${filePath}`
            );
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        };

        deleteImage(product.bigImage);
        product.smallImages.forEach((imagePath) => {
          deleteImage(imagePath);
        });
      }

      // update data produk
      await Product.findByIdAndUpdate(req.params.id, {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        bigImage:
          req.files && req.files.bigImage
            ? `../uploads/${req.files.bigImage[0].filename}`
            : product.bigImage,
        smallImages:
          req.files && req.files.smallImages
            ? req.files.smallImages
                .map((file) => `../uploads/${file.filename}`)
                .sort()
            : product.smallImages,
      });

      // redirect ke halaman dashboard setelah edit/update
      const currentPage = req.body.currentPage || 1;
      res.redirect(`/admin/dashboard/manage?page=${currentPage}`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// method delete (DELETE)
router.delete("/manage/delete/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await Product.findByIdAndDelete(req.params.id);

    // fungsi delete gambar berdasarkan filepath dari path image produk
    const deleteImage = (filePath) => {
      try {
        const fullPath = path.join(
          __dirname,
          `../../public/uploads/${filePath}`
        );
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (error) {
        console.log("Error deleting image:", error);
      }
    };

    // delete big image dan small images
    deleteImage(product.bigImage);
    product.smallImages.forEach((imagePath) => {
      deleteImage(imagePath);
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
