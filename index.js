const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const developerRoutes = require("./routes/developerRoutes"); // Rota dosyamızı dahil ettik
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// --- MONGODB BAĞLANTISI ---
const dbURI =
  "mongodb+srv://teamcraft_user:mySuperSecurePassword123@teamcraftcluster.x3yegjt.mongodb.net/?appName=TeamCraftCluster";
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("MongoDB veritabanına başarıyla bağlanıldı.");
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
    });
  })
  .catch((err) => console.log(err));

// --- MIDDLEWARE ---
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// --- SESSION MIDDLEWERE ---
app.use(
  session({
    secret: "aisşdlfkgjh852", // çerezleri imzalamak için kullanılan bir anahtar.
    resave: false, // oturum değişmediği sürece tekrar keydetme
    saveUninitialized: false, // henüz veri eklenmemiş "boş" oturumları kaydetme
    store: MongoStore.create({ mongoUrl: dbURI }), // oturumları mongoDB'de sakla
  })
);

// --- ROTALAR (ROUTES) ---
// Gelen tüm istekleri '/developerRoutes' dosyasına yönlendir.
app.use(authRoutes);
app.use(developerRoutes);
