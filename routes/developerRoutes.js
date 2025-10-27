const express = require("express");
const Developer = require("../models/developer");
const { requireAuth } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();

// Anasayfa artık geliştirici listesine yönlendiriyor
router.get("/", (req, res) => {
  console.log("[GET] / -> /developers yönlendirmesi yapılıyor");
  res.redirect("/developers");
});

// Tüm geliştiricileri listele
router.get("/developers", (req, res) => {
  const searchQuery = req.query.search;
  let filter = {};

  console.log("[GET] /developers isteği alındı.");
  if (searchQuery) {
    filter = { skills: { $regex: searchQuery, $options: "i" } };
    console.log("Arama filtresi uygulandı:", filter);
  } else {
    console.log("Arama filtresi yok, tüm geliştiriciler listelenecek.");
  }

  Developer.find(filter)
    .sort({ createdAt: -1 })
    .then((developers) => {
      console.log(`Toplam ${developers.length} geliştirici bulundu.`);
      res.render("developers", {
        developers: developers,
        searchQuery: searchQuery,
      });
    })
    .catch((err) => {
      console.error("Developer listeleme hatası:", err);
      res.status(500).send("Bir hata oluştu.");
    });
});

// Profil ekleme sayfasını göster
router.get("/developers/add", requireAuth, (req, res) => {
  console.log(
    `[GET] /developers/add isteği - kullanıcı ID: ${req.session.userId}`
  );
  res.render("add-developer");
});

// Yeni bir geliştirici ekleme
// Yeni bir geliştirici ekleme
router.post("/developers", requireAuth, upload.single("cvFile"), (req, res) => {
  const { developerName, developerSkills, developerLinkedin } = req.body;

  const newDeveloper = {
    name: developerName,
    skills: developerSkills,
    linkedin: developerLinkedin,
    author: req.session.userId,
  };

  if (req.file) {
    // Eğer bir dosya yüklendiyse, dosya yolunu objeye ekle
    newDeveloper.cvFilePath = req.file.path;
  }

  const developer = new Developer(newDeveloper);
  developer
    .save()
    .then((result) => res.redirect("/developers"))
    .catch((err) => console.error("Profil kaydetme hatası:", err));
});

// Profili güncelle
router.post(
  "/developers/update/:id",
  requireAuth,
  upload.single("cvFile"),
  async (req, res) => {
    try {
      const developer = await Developer.findById(req.params.id);
      if (!developer || developer.author.toString() !== req.session.userId) {
        return res.redirect("/developers");
      }

      const updatedData = {
        name: req.body.developerName,
        skills: req.body.developerSkills,
        linkedin: req.body.developerLinkedin,
      };

      if (req.file) {
        // Eğer yeni bir dosya yüklendiyse, yolu güncelle
        updatedData.cvFilePath = req.file.path;
      }

      await Developer.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect(`/developers/${req.params.id}`);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      res.redirect("/developers");
    }
  }
);

// Tek bir geliştiricinin detayını göster
router.get("/developers/:id", (req, res) => {
  console.log(`[GET] /developers/${req.params.id} isteği alındı`);
  Developer.findById(req.params.id)
    .then((developer) => {
      if (!developer) {
        console.warn(`Profil bulunamadı: ${req.params.id}`);
        return res.status(404).send("Profil bulunamadı.");
      }
      console.log("Profil bulundu:", developer.name);
      res.render("details", { developer: developer });
    })
    .catch((err) => {
      console.error("Hata (profil detayında):", err);
      res.status(404).send("Profil bulunamadı.");
    });
});

// Profili sil (sahiplik kontrolü ile)
router.post("/developers/delete/:id", requireAuth, async (req, res) => {
  console.log(
    `[POST] /developers/delete/${req.params.id} isteği - kullanıcı ID: ${req.session.userId}`
  );
  try {
    const id = req.params.id;
    const developer = await Developer.findById(id);

    if (!developer) {
      console.warn("Silinmek istenen profil bulunamadı:", id);
    } else if (developer.author.toString() !== req.session.userId) {
      console.warn(
        `Yetkisiz silme girişimi! Kullanıcı ${req.session.userId}, profilin sahibi değil.`
      );
    } else {
      await Developer.findByIdAndDelete(id);
      console.log(`Profil silindi: ${id}`);
    }

    res.redirect("/developers");
  } catch (error) {
    console.error("Silme sırasında hata:", error);
    res.redirect("/developers");
  }
});

module.exports = router;
