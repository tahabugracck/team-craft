// routes/authRoutes.js
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Kayıt sırasında hata:", error);
    res.redirect("/register");
  }
});

// Giriş sayfasını göster
router.get("/login", (req, res) => {
  res.render("login");
});

// KULLANICI GİRİŞİ (EN KRİTİK BÖLÜM BURASI)
router.post("/login", async (req, res) => {
  console.log(`[POST /login] Giriş denemesi: ${req.body.email}`);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.warn(`[POST /login] Kullanıcı bulunamadı: ${req.body.email}`);
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      // Şifreler eşleşti, OTURUMU BAŞLAT!
      req.session.userId = user._id;

      // --- OTURUMUN KAYDEDİLİP EDİLMEDİĞİNİ KONTROL EDELİM ---
      req.session.save((err) => {
        if (err) {
          console.error("HATA: Oturum kaydedilemedi!", err);
          return res.redirect("/login");
        }
        console.log(
          `BAŞARILI: Oturum başlatıldı. Session User ID: ${req.session.userId}`
        );
        res.redirect("/developers");
      });
      // -----------------------------------------------------------
    } else {
      console.warn(`[POST /login] Yanlış şifre: ${req.body.email}`);
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Giriş sırasında kritik hata:", error);
    res.redirect("/login");
  }
});

// Çıkış yap
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/developers");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = router;
