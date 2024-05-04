const { Router } = require("express");
const forgot = Router();
const Account = require("../../models/account");
const nodemailer = require("nodemailer");

forgot.get("/", (req, res) => {
  const token = req.query.token;
  const email = req.session.email;
  req.session.forgotPassword = true;
  req.session.emailStore = email;
  if (
    email === undefined ||
    email === "" ||
    token === "" ||
    token === undefined
  ) {
    return res.redirect("/notFound");
  } else if (token === "abc123") {
    console.log("masuk else");
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

    return res.redirect("/verificationPage");
  } else {
    res.render("forgotPassword", {
      info: "",
    });
  }
});

forgot.post("/savePassword", async (req, res) => {
  const email = req.session.email;
  const newPassword = req.body.newPassword.trim();
  if (newPassword.length >= 8 && /\d/.test(newPassword)) {
    const account = await Account.findOne({ email: email });
    account.password = newPassword;
    await account.save();
    return res.redirect("/login");
  } else {
    console.log(forgotPassword);
    return res.render("forgotPassword", {
      info: "Password must be at least 8 characters long and contain at least one number",
    });
  }
});

forgot.post("/saveUserName", async (req, res) => {
  const email = req.session.email;
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();

  console.log("First Name:", firstName);
  console.log("Last Name:", lastName);

  const account = await Account.findOne({ email: email });
  console.log("Account:", account); // Cek apakah account ditemukan

  if (account) {
    account.firstName = firstName;
    account.lastName = lastName;
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    await account.save();
    console.log("Account updated:", account); // Cek apakah perubahan disimpan dengan benar
    return res.redirect("/");
  } else {
    console.log("Account not found for email:", req.session.emailStore);
    return res.redirect("/error"); // Redirect ke halaman error jika akun tidak ditemukan
  }
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

module.exports = forgot;
