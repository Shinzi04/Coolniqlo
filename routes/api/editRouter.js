const { Router } = require("express");
const edit = Router();
const Account = require("../../models/account");

edit.post('/editing', (req, res) => {
    if(req.session.email === undefined || req.session.email === ''){
        return res.redirect('/notFound')
    }
    else{
        return res.render('edit', {
            info : '',
            firstName : req.session.firstName,
            lastName : req.session.lastName
        });
    }
});

module.exports = edit;