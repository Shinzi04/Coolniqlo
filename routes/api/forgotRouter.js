const { Router } = require("express");
const forgot = Router();
const Account = require("../../models/account");
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const fs = require('fs');
// Router ini dipakai oleh edit.js, di mana ketika sudah login dan menekan tombol edit di pojok kiri bawah
forgot.get('/', (req, res) => {
    const token = req.query.token;
    const email = req.session.email;
    req.session.forgotPassword = true;
    req.session.emailStore = email;
    if(email === undefined || email === ''  || token === '' || token === undefined){
        return res.redirect('/notFound')
    }
    else if(token === 'abc123'){
        const verificationCode = generateNumericCode(6);
        req.session.vCode = verificationCode;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const mailOptions = {
            from: "Coolniqlo",
            to: email, 
            subject: "Coolniqlo - Verification Code",
            text: `Your verification code is ${verificationCode}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

    return res.redirect("/verificationPage");
  } else {
    res.render("forgotPassword", {
      info: "",
    });
  }
});

// Method POST /savepassword, dipakai oleh forgotPassword.js
forgot.post('/savePassword', async (req, res) => {
    const email = req.session.email;
    const newPassword = req.body.newPassword.trim(); // Menghapus spasi di awal dan akhir

    // akan menyimpan kata sandi baru, jika panjang kata sandi minimal 8 dan terdapat angka
    if (newPassword.length >= 8 && /\d/.test(newPassword)){
        const account = await Account.findOne({ email: email });
        account.password = newPassword;
        await account.save();
        return res.redirect('/login');
    }else {
        return res.render('forgotPassword', { info: "Password must be at least 8 characters long and contain at least one number" });
    }
    
});

// Method POST /saveUsername dan /deleteUser dipakai edit.js
forgot.post('/saveUserName', async (req, res) => {
    const email = req.session.email;
    const firstName = req.body.firstName.trim(); // Menghapus spasi di awal dan akhir
    const lastName = req.body.lastName.trim(); // Menghapus spasi di awal dan akhir

  const account = await Account.findOne({ email: email });
  console.log("Account:", account); // Cek apakah account ditemukan

    // Akan memperbarui username jika akun ditemukan
    if (account) {
        account.firstName = firstName;
        account.lastName = lastName;
        req.session.firstName = firstName;
        req.session.lastName = lastName;
        await account.save();
        return res.redirect('/');
    } else {
        console.log("Account not found for email:", req.session.emailStore);
        return res.redirect('/error'); // Redirect ke halaman error jika akun tidak ditemukan
    }
});

forgot.post('/deleteUser', async (req, res) => {
    const email = req.session.email;
    const account = await Account.findOne({ email: email});

    // Akan mendelete akun jika akun ditemukan
    if (account) {
        await Account.deleteOne({ email: email });
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
        req.session.email = '';
        req.session.emailStore = '';
        req.session.firstName = '';
        req.session.lastName = '';
        console.log("Account deleted:", account); // Cek apakah akun dihapus
        return res.redirect('/');
    } 
});

// Fungsi untuk membuat 6 angka random untuk kode verifikasi
function generateNumericCode(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = forgot;
