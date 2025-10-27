const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    // eğer session'da userId varsa kullanıcı giriş yaomış demektir. isteğin devamına izin ver.
    next();
  } else {
    res.redirect("/login"); // eğer userId yoksa login sayfasına yönlendir.
  }
};

module.exports = { requireAuth };
