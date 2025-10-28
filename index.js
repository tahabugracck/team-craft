require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const developerRoutes = require("./routes/developerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// --- MONGODB BAĞLANTISI ---
const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("MongoDB veritabanına başarıyla bağlanıldı.");
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
    });
  })
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// --- MIDDLEWARE ---
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "bu cok gizli ve karmasik bir anahtar olmali cunku guvenlik icin onemli",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbURI }),
  })
);

app.use(flash());

// Kullanıcı ve flash mesajları bilgisini tüm view'lara göndermek için middleware
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.info_msg = req.flash("info_msg"); // info_msg eklendi
  next();
});

// --- ROTALAR (ROUTES) ---
app.use(authRoutes);
app.use(developerRoutes);