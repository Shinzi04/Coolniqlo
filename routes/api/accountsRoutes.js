const { Router } = require("express");
const accRouter = Router();
const Account = require("../../models/account");
const passport = require("passport");
const bcrypt = require("bcrypt");
const Product = require("../../models/productList");

const nodemailer = require("nodemailer");

//method get
accRouter.get('/', isLogin,async (req, res) => {  try {
    req.session.emailStore = '';
    const account = await Account.find();
    res.render("login", {
      account,
      title: "Account - Coolniqlo",
      info:'',
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
})

//method post
accRouter.post('/register', isLogin, async (req, res) => {
    try {
        // Mengubah email menjadi lowercase
        const email = req.body.email.toLowerCase();
        
        const existingAcc = await Account.findOne({ email: email });
        if (existingAcc) {
            return res.render('login', { info: "Account with this Email already exists" });
        } else {
            const pw = req.body.password.trim(); // Trim kata sandi
            if (pw.length >= 8 && /\d/.test(pw)) { // Memeriksa panjang kata sandi dan keberadaan angka
                req.session.emailStore = email; // Simpan email dalam lowercase
                req.session.firstNameStore = req.body.firstName;
                req.session.lastNameStore = req.body.lastName;
                req.session.passwordStore = pw;
  
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
                res.redirect('/verificationPage');
            } else {
                res.render("login", { // Perbaikan path render
                    title: "Account - Coolniqlo",
                    info: 'Password must be at least 8 characters long and contain at least one number',
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
  });
  


accRouter.post('/enter',isLogin, async (req,res) =>{
    try {
        const check_email = req.body.email.toLowerCase();
        const check = await Account.findOne({ email: check_email });
        if(!check){
            return res.render('login', { info: "Email or Password is incorrect" });
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch){
            let products = await Product.find();
            req.session.email = req.body.email;
            req.session.firstName = check.firstName
            req.session.lastName = check.lastName
            return res.render('',{email:req.session.email,firstName: check.firstName,lastName:check.lastName,title: "Coolniqlo", style: "../css/style.css" });
        }
        else{
            return res.render('login', { info: "Email or Password is incorrect" });
        }
    } catch (error) {
        
    }
});

function isLogin(req, res, next) {
    const user = req.session.email;
    if (user != null) {
    res.redirect('/');
    }
    return next();
  }

function generateNumericCode(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }  


module.exports = accRouter;