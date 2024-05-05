const { Router } = require("express");
const edit = Router();
const Account = require("../../models/account");

// Router ini dipakai index.js, di mana ketika menekan tombol Edit, maka router ini akan terpakai
edit.post('/editing', (req, res) => {
    if(req.session.email === undefined || req.session.email === ''){
        return res.redirect('/notFound') // akan res.redirect ke halaman notFound, ketika tidak ada session email
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