const { Router } = require("express");
const accRouter = Router();
const Account = require("../../models/account");
const passport = require("passport");
const bcrypt = require("bcrypt");
const Product = require("../../models/productList");

//method get
accRouter.get('/', async (req, res) => {  try {
    const account = await Account.find();
    res.render("login", {
      account,
      title: "Account - Coolniqlo",
      info:'',
    });
  } catch (error) {
    console.log('errornih')
    res.status(500).send("Internal Server Error");
  }
})

//method post
accRouter.post('/register', async (req, res) => {
    try {
        const existingAcc = await Account.findOne({ email: req.body.email });
        if (existingAcc){
            return res.render('login', { info: "Account with this Email already exists" });
        }
        const account = new Account(req.body);
        await account.save();
        res.redirect('/login')
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
})

accRouter.post('/enter', async (req,res) =>{
    try {
        const check = await Account.findOne({ email: req.body.email });
        if(!check){
            return res.render('login', { info: "Account with this Email doesn't exist" });
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch){
            let products = await Product.find();
            req.session.email = req.body.email;
            return res.render('',{ products, title: "Coolniqlo", style: "./../style.css" });
        }
        else{
            return res.render('login', { info: "Wrong Password" });
        }
    } catch (error) {
        
    }
});

module.exports = accRouter;