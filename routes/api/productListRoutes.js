const { Router } = require('express');
const router = Router();
const Product = require('../../models/productList');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Account = require('../../models/account');
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

// konfigurasi multer untuk handling file yang di upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const productId = req.body.id;
      const dir = `public/assets/Items/${productId}`;
      await fs.promises.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// method get (READ) untuk mendapatkan list produk
router.get('/', isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    res.render('dashboard', {
      products,
      title: 'Manage Products - Coolniqlo',
      style: '../dashboard.css',
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// method post (CREATE) untuk menambahkan produk
router.post(
  '/add',
  upload.fields([
    { name: 'bigImage', maxCount: 1 },
    { name: 'smallImages', maxCount: 8 },
  ]),
  async (req, res) => {
    try {
      const productId = req.body.id;
      console.log(productId);

      // product ID harus unik
      if (await Product.findOne({ id: productId })) {
        return res.status(400).send('Product with this ID already exists');
      }

      const bigImage = req.files['bigImage'][0];
      const smallImages = req.files['smallImages'];

      // membuat array path smallImages
      const smallImagePaths = await Promise.all(
        smallImages.map(async (smallImage) => {
          return `/../assets/Items/${productId}/${smallImage.originalname}`;
        })
      );

      // mengurut array path smallImages secara ascending
      smallImagePaths.sort();

      const product = new Product({
        id: productId,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        bigImage: `/../assets/Items/${productId}/${bigImage.originalname}`,
        smallImages: smallImagePaths,
      });
      product.save();
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }
);

// method put (UPDATE) untuk perbarui produk
router.put('/edit/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      bigImage: req.body.bigImage,
      smallImages: req.body.smallImages.split('\n'),
    });
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// method delete (DELETE) untuk menghapus produk dan juga menghapuskan file direktori image
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    const productDir = path.join(__dirname, `/../../public/assets/Items/${product.id}`);
    fs.rmdirSync(productDir, { recursive: true });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Internal Server Error');
  }
});

function isAdmin(req, res, next) {
  const user = req.session.email;
  if (user === 'admin@gmail.com') {
    return next();
  }
  res.redirect('/notFound');
}

module.exports = router;
