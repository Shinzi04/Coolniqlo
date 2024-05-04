const { Router } = require("express");
const sendMail = Router();
const Account = require("../../models/account");
const nodemailer = require("nodemailer");

// Router yang dipakai ketika menekan 'forgot password' pada halaman login
sendMail.get("/", async (req, res) => {
  // hanya bisa masuk ke halaman sendEmail (di mana halaman ini untuk mengirimkan kode verifikasi ke email, jika lupa password) jika menekan forgot password
  // pada halaman login.
  if (req.session.sendEmail === true) {
    req.session.sendEmail = false;
    res.render("sendEmail", {
      info: "",
    });
  } else {
    res.redirect("/notFound");
  }
});

//Method POST untuk memberikan kode verifikasi ke email 
sendMail.post("/sendCodeToEmail", async (req, res) => {
    const email = req.body.email.toLowerCase();
    const account = await Account.findOne({ email: email});

    // Method POST ini hanya berfungsi jika ada account dengan email yang dimasukan
    if (!account) {
      return res.render("sendEmail", {
        info: "Email not found",
      });
    }

    else{
      const verificationCode = generateNumericCode(6);
      req.session.vCode = verificationCode;
      req.session.email = email;
      req.session.sendEmailToken = true;
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
    req.session.emailStore = email;
    return res.redirect('/verificationPage')
    }


});

// fungsi untuk membuat 6 angka random yang akan dipakai sebagai kode verifikasi
function generateNumericCode(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = sendMail;
