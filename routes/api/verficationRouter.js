const { Router } = require("express");
const verify = Router();
const Account = require("../../models/account");

verify.get('/', isRegister, (req, res) => {
    return res.render('verificationPage', {
        info : '',
    });
});

verify.post('/verify', isRegister, (req, res) => {
    const code = req.body.code.trim();
    const forgotPassword = req.session.forgotPassword; 
    if (code === req.session.vCode && !forgotPassword) {
        const account = new Account({
            email: req.session.emailStore,
            firstName: req.session.firstNameStore,
            lastName: req.session.lastNameStore,
            password: req.session.passwordStore,
        });
        account.save();
        req.session.emailStore = '';
        req.session.firstNameStore = '';
        req.session.lastNameStore = '';
        req.session.passwordStore = '';
        req.session.vCode = '';
        return res.redirect('/login');
    } else if (forgotPassword){
        console.log('else if forgotPassword')
        console.log(req.session.vCode)
        if (code === req.session.vCode){
            const token = 'abcdefg'; // Misalnya, Anda memiliki token yang sudah ada atau Anda dapat membuatnya
            return res.redirect(`/forgotPassword?token=${token}`);
        }
        else {
            console.log(forgotPassword)
            return res.render('verificationPage', { info: "Invalid verification code" });
        }
    } 
    else {
        console.log(forgotPassword)
        return res.render('verificationPage', { info: "Invalid verification code" });
    }
});



function isRegister(req, res, next) {
    const checkEmail = req.session.emailStore;
    console.log(`email ${checkEmail}`)
    if (checkEmail === '' || checkEmail=== undefined) {
    return res.redirect('/notFound');
    }
    return next();
  }

module.exports = verify;