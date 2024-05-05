const { Router } = require("express");
const changePicture = Router();
const Account = require("../../models/account");
const path = require("path");
const multer = require("multer");
const fs = require('fs');
// Tentukan direktori tempat menyimpan file yang diunggah
const uploadDirectory = path.resolve(__dirname,'..', '..', 'public', 'assets', 'account_profile_pictures');

// Konfigurasi multer untuk menangani unggahan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      // Dapatkan ekstensi file
      const ext = path.extname(file.originalname);
      // Ambil nama file tanpa ekstensi
      const filenameWithoutExt = path.basename(file.originalname, ext);
      // Buat nama file baru dengan menambahkan tanggal saat ini di tengah
      const newFileName = filenameWithoutExt + '-' + Date.now() + ext;
      cb(null, newFileName);
    }
  });
  
  const upload = multer({ storage: storage });

  // Router ini dipakai index.js, di mana ketika menekan tombol Edit, maka router ini akan terpakai
  changePicture.post('/upload', upload.single('profilePicture'), async(req, res) => {
    const account = await Account.findOne({ email: req.session.email});
    const oldProfilePicturePath = account.profilePicture;
    const fullPath = path.join(__dirname, '..', '..', 'public', oldProfilePicturePath);

    if (fullPath) {
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error('Gagal menghapus gambar lama:', err);
          } else {
            console.log('Gambar lama berhasil dihapus');
          }
        });
      }
    const uploadedFile = req.file;
    const relativePath = path.relative(path.join(__dirname, '..', '..', 'public'), uploadedFile.path);

    account.profilePicture = '/' + relativePath;
    await account.save();
    req.session.profilePicture = account.profilePicture;
    return res.render('edit', {
        info : '',
        firstName : req.session.firstName,
        lastName : req.session.lastName,
        profilePicture : req.session.profilePicture
    });
});

module.exports = changePicture;