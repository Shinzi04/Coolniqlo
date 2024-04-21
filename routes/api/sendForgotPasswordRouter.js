const { Router } = require("express");
const sendForgotPassword = Router();
const Account = require("../../models/account");

sendForgotPassword.get('/', async (req, res) => {
    const token = req.query.token;
    try {
        
        if (token === 'forgotPassword123'){
            req.session.sendEmail = true;
            return res.redirect('/sendEmail');
        } else {
            return res.redirect('/notFound');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = sendForgotPassword;