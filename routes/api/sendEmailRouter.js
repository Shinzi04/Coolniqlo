const { Router } = require("express");
const sendMail = Router();
const Account = require("../../models/account");
const nodemailer = require("nodemailer");

sendMail.get("/", async (req, res) => {
  if (req.session.sendEmail === true) {
    req.session.sendEmail = false;
    res.render("sendEmail", {
      info: "",
    });
  } else {
    res.redirect("/notFound");
  }
});

sendMail.post("/sendCodeToEmail", async (req, res) => {
    const verificationCode = generateNumericCode(6);
    req.session.vCode = verificationCode;
    const email = req.body.email.toLowerCase();
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
    to: email, // Gunakan email dalam lowercase untuk mengirim email
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
});

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
