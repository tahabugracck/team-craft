const express = require("express");
const Developer = require("../models/developer");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router(); // app yerine router kullanıyoruz

// Ana sayfa artık listeleme sayfası
router.get("/", (req, res) => {
  res.redirect("/developers");
});

// Tüm developerları listele (GET)
router.get("/developers", (req, res) => {
  const searchQuery = req.query.search;
  let filter = {};
  if (searchQuery) {
    filter = { skills: { $regex: searchQuery, $options: "i" } };
  }
  Developer.find(filter)
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("developers", {
        developers: result,
        searchQuery: searchQuery,
      });
    })
    .catch((err) => console.log(err));
});

// Profil ekleme formunu gösteren yeni bir rota
router.get("/developers/add", requireAuth, (req, res) => {
  res.render("add-developer");
});

// Yeni developer ekle (POST)
router.post("/developers", requireAuth, (req, res) => {
  const developer = new Developer({
    name: req.body.developerName,
    skills: req.body.developerSkills,
    linkedin: req.body.developerLinkedin,
  });
  developer
    .save()
    .then((result) => res.redirect("/developers"))
    .catch((err) => console.log(err));
});

// Developer detay sayfası (GET)
router.get("/developers/:id", (req, res) => {
  const id = req.params.id;
  Developer.findById(id)
    .then((result) => res.render("details", { developer: result }))
    .catch((err) => res.status(404).send("Profil bulunamadı."));
});

// Düzenleme sayfasını göster (GET)
router.get("/developers/edit/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  Developer.findById(id)
    .then((result) => res.render("edit", { developer: result }))
    .catch((err) => res.status(404).send("Profil bulunamadı."));
});

// Profil güncelle (POST)
router.post("/developers/update/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  const updatedData = {
    name: req.body.developerName,
    skills: req.body.developerSkills,
    linkedin: req.body.developerLinkedin,
  };
  Developer.findByIdAndUpdate(id, updatedData)
    .then((result) => res.redirect(`/developers/${result._id}`))
    .catch((err) => console.log(err));
});

// Developer sil (POST)
router.post("/developers/delete/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  Developer.findByIdAndDelete(id)
    .then((result) => res.redirect("/developers"))
    .catch((err) => console.log(err));
});

module.exports = router; // router objesini index.js'de kullanabilmek için dışa aktarma.
