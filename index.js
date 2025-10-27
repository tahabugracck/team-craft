// index.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const developerRoutes = require("./routes/developerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// --- MONGODB BAĞLANTISI ---
const dbURI =
  "mongodb+srv://teamcraft_user:mySuperSecurePassword123@teamcraftcluster.x3yegjt.mongodb.net/TeamCraftDB?retryWrites=true&w=majority&appName=TeamCraftCluster";

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
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret:
      "bu cok gizli ve karmasik bir anahtar olmali cunku guvenlik icin onemli",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbURI }),
  })
);

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// --- ROTALAR (ROUTES) ---
// Sıralama önemlidir: Önce kimlik doğrulama, sonra diğerleri.
app.use(authRoutes);
app.use(developerRoutes);
