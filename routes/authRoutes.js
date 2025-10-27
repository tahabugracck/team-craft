const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// Kayıt sayfasını göster (GET)
router.get("/register", (req, res) => {
  res.render("register");
});

// Yeni kullanıcı kaydı oluştur (POST)
router.post("/register", async (req, res) => {
  try {
    // şifreyi hash'lemeden önce "salt" oluşturuyoruz.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
});

// Giriş sayfasını göster (GET)
router.get("/login", (req, res) => {
  res.render("login");
});

// Kullanıcı girişi yap (POST)
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // e-posta yoksa
      return res.redirect("/login");
    }

    // veritabanındaki hash'lenmiş şifre ile kullanıcının girdiği şifreyi karşılaştır
    if (await bcrypt.compare(req.body.password, user.password)) {
      // şifreler eşleşiyorsa
      console.log("Giriş başarılı");
      res.redirect("/developers");
    } else {
      // şifreler eşleşmiyorsa
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});

// Çıkış yap (GET)
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/developers");
    }
    res.clearCookie("connect.sid"); // session cookie'sini temizle
    res.redirect("/login");
  });
});

module.exports = router;
