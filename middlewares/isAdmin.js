function isAdmin(req, res, next) {
  const user = req.session.email;
  if (user === "admin@gmail.com") {
    return next();
  }
  res.redirect("/notFound");
}

module.exports = isAdmin;
