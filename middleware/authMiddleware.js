// middleware/authMiddleware.js
const requireAuth = (req, res, next) => {
  console.log(
    `[Auth Middleware] ${req.method} ${req.originalUrl} için yetki kontrolü yapılıyor...`
  );

  if (req.session && req.session.userId) {
    console.log(
      `[Auth Middleware] Yetki kontrolü başarılı. Session User ID: ${req.session.userId}`
    );
    next(); // Kullanıcı giriş yapmış, devam et.
  } else {
    console.log(
      "[Auth Middleware] Yetki kontrolü BAŞARISIZ. Kullanıcı giriş yapmamış. /login adresine yönlendiriliyor."
    );
    res.redirect("/login"); // Kullanıcı giriş yapmamış, yönlendir.
  }
};

module.exports = { requireAuth };
