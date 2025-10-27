// index.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

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
    secret: "asdfghjkl123456789",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbURI }),
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// --- ROTALAR (ROUTES) ---
// Sıralama önemlidir: Önce kimlik doğrulama, sonra diğerleri.
app.use(authRoutes);
app.use(developerRoutes);
