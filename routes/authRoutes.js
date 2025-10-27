const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// Kayıt sayfasını göster
router.get("/register", (req, res) => {
  res.render("register");
});

// Yeni kullanıcı kaydı oluştur
router.post("/register", async (req, res) => {
  try {
    // E-postanın zaten kullanımda olup olmadığını kontrol et
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      req.flash("error_msg", "Bu e-posta adresi zaten kullanılıyor.");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    req.flash(
      "success_msg",
      "Başarıyla kayıt oldunuz! Şimdi giriş yapabilirsiniz."
    );
    res.redirect("/login");
  } catch (error) {
    req.flash("error_msg", "Kayıt oluşturulamadı. Lütfen tekrar deneyin.");
    console.error("Kayıt sırasında hata:", error);
    res.redirect("/register");
  }
});

// Giriş sayfasını göster
router.get("/login", (req, res) => {
  // URL'den gelen 'message' parametresini kontrol et
  if (req.query.message === "logout_success") {
    req.flash("success_msg", "Başarıyla çıkış yaptınız.");
  }
  res.render("login");
});

// Kullanıcı girişi yap
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error_msg", "E-posta veya şifre hatalı.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      // Şifreler eşleşti, oturumu başlat
      req.session.userId = user._id;

      req.session.save((err) => {
        if (err) {
          console.error("Hata: Oturum kaydedilemedi!", err);
          return res.redirect("/login");
        }
        req.flash("success_msg", "Başarıyla giriş yaptınız.");
        res.redirect("/developers");
      });
    } else {
      req.flash("error_msg", "E-posta veya şifre hatalı.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Giriş sırasında kritik hata:", error);
    req.flash("error_msg", "Bir hata oluştu. Lütfen tekrar deneyin.");
    res.redirect("/login");
  }
});

// Çıkış yap (Nihai ve Güvenli Yöntem)
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Çıkış sırasında oturum sonlandırılamadı:", err);
      return next(err);
    }
    res.clearCookie("connect.sid");
    // Yönlendirme ile mesajı taşı
    res.redirect("/login?message=logout_success");
  });
});

module.exports = router;
