const { Router } = require("express");
const verify = Router();
const Account = require("../../models/account");

// Router ini dipakai oleh edit.js, di mana ketika menekan forgot password, akan mengirimkan kode verifikasi ke email
//

verify.get('/', isRegister, (req, res) => {
    return res.render('verificationPage', {
        info : '',
    });
});

verify.post('/verify', isRegister, (req, res) => {
    const code = req.body.code.trim();
    const forgotPassword = req.session.forgotPassword; 
    const sendEmailToken = req.session.sendEmailToken;

    // if untuk pembuatan akun (register)
    if (code === req.session.vCode && !forgotPassword && !sendEmailToken) {
        console.log('bikin akun nih')
        const account = new Account({
            email: req.session.emailStore,
            firstName: req.session.firstNameStore,
            lastName: req.session.lastNameStore,
            password: req.session.passwordStore,
            profilePicture: "/../assets/account_profile_pictures/defaultProfilePicture.png",
        });
        account.save();

        // menghapus session
        req.session.emailStore = '';
        req.session.firstNameStore = '';
        req.session.lastNameStore = '';
        req.session.passwordStore = '';
        req.session.vCode = '';
        return res.redirect('/login');

        // else if untuk changepassword yang ditekan di halaman utama (setelah login ada tombol edit dipojok kiri bawah halaman utama.
        // kemudian ada changepassword. Setelah memasukan email, akan berpindah ke halaman verifikasi, lalu mengirimkan kode verifikasi ke email)
    } else if (forgotPassword){
        if (code === req.session.vCode){
            const token = 'abcdefg'; 
            return res.redirect(`/forgotPassword?token=${token}`);
        }
        else {
            return res.render('verificationPage', { info: "Invalid verification code" });
        }
    } else if (sendEmailToken){ //else if untuk forgotpassword di halaman login
        if(code === req.session.vCode){
            return res.render('forgotPassword', { info: "" });
        }
        else{
            return res.render('verificationPage', { info: "Invalid verification code" });
        }
    }

    // akan memberikan informasi 'Invalid verification code' jika kode verifikasi salah
    else {
        return res.render('verificationPage', { info: "Invalid verification code" });
    }
});


// fungsi untuk mengecek apakah user sudah memiliki akun
function isRegister(req, res, next) {
    const checkEmail = req.session.emailStore;
    if (checkEmail === '' || checkEmail=== undefined) {
    return res.redirect('/notFound');
    }
    return next();
  }

module.exports = verify;