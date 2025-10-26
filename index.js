const express = require("express");
const mongoose = require("mongoose");
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

// --- ROTALAR (ROUTES) ---
// Gelen tüm istekleri '/developerRoutes' dosyasına yönlendir.
app.use(authRoutes);
app.use(developerRoutes);
