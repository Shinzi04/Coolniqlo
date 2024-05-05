function isUser(req, res, next) {
  const user = req.session.email;
  if (user && user !== "admin@gmail.com") {
    return next();
  }
  res.redirect("/login");
}

module.exports = isUser;
