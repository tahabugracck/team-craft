const express = require("express");
const Developer = require("../models/developer");
const { requireAuth } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");
const { parseCvForSkills } = require("../services/cvParserService");

const router = express.Router();

// Anasayfa artık geliştirici listesine yönlendiriyor
router.get("/", (req, res) => {
    res.redirect("/developers");
});

// Tüm geliştiricileri listele (Sayfalamalı)
router.get('/developers', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search;
        let filter = {};
        if (searchQuery) {
            filter = { skills: { $regex: searchQuery, $options: 'i' } };
        }

        const totalDevelopers = await Developer.countDocuments(filter);
        const developers = await Developer.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.render('developers', {
            developers: developers,
            searchQuery: searchQuery,
            currentPage: page,
            totalPages: Math.ceil(totalDevelopers / limit)
        });
    } catch (err) {
        console.error("Developer listeleme hatası:", err);
        res.status(500).send("Bir hata oluştu.");
    }
});

// Profil ekleme sayfasını göster
router.get("/developers/add", requireAuth, (req, res) => {
    res.render("add-developer");
});

// Yeni bir geliştirici ekle
router.post('/developers', requireAuth, upload.single('cvFile'), async (req, res) => {
    try {
        let skills = req.body.developerSkills;
        if (req.file && !skills) {
            const extractedSkills = await parseCvForSkills(req.file.path);
            if (extractedSkills) {
                skills = extractedSkills;
            }
        }
        const newDeveloper = {
            name: req.body.developerName,
            skills: skills,
            linkedin: req.body.developerLinkedin,
            author: req.session.userId,
            cvFilePath: req.file ? req.file.path : undefined
        };
        const developer = new Developer(newDeveloper);
        await developer.save();
        req.flash('success_msg', 'Profil başarıyla oluşturuldu!');
        res.redirect('/developers');
    } catch (err) {
        console.error("Profil kaydetme hatası:", err);
        req.flash('error_msg', 'Profil oluşturulurken bir hata oluştu.');
        res.redirect('/developers/add');
    }
});

// Giriş yapmış kullanıcının kendi profilini bulur
router.get('/developers/my-profile', requireAuth, async (req, res) => {
    try {
        const developer = await Developer.findOne({ author: req.session.userId });
        if (developer) {
            res.redirect(`/developers/${developer._id}`);
        } else {
            req.flash('info_msg', 'Henüz bir geliştirici profiliniz bulunmuyor. Lütfen bir tane oluşturun.');
            res.redirect('/developers/add');
        }
    } catch (err) {
        console.error("Profilim rotasında hata:", err);
        req.flash('error_msg', 'Profilinize erişilirken bir hata oluştu.');
        res.redirect('/developers');
    }
});

// Düzenleme sayfasını göster
router.get('/developers/edit/:id', requireAuth, async (req, res) => {
    try {
        const developer = await Developer.findById(req.params.id);
        if (!developer || developer.author.toString() !== req.session.userId) {
            return res.redirect('/developers');
        }
        res.render('edit', { developer });
    } catch (error) {
        res.redirect('/developers');
    }
});

// Tek bir geliştiricinin detayını göster
router.get("/developers/:id", async (req, res) => {
    try {
        const developer = await Developer.findById(req.params.id);
        if (!developer) {
            return res.status(404).send("Profil bulunamadı.");
        }
        res.render("details", { developer: developer });
    } catch (err) {
        res.status(404).send("Profil bulunamadı.");
    }
});

// Profili güncelle
router.post("/developers/update/:id", requireAuth, upload.single("cvFile"), async (req, res) => {
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
            updatedData.cvFilePath = req.file.path;
        }
        await Developer.findByIdAndUpdate(req.params.id, updatedData);
        req.flash('success_msg', 'Profil başarıyla güncellendi.');
        res.redirect(`/developers/${req.params.id}`);
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        res.redirect("/developers");
    }
});

// Profili sil
router.post("/developers/delete/:id", requireAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const developer = await Developer.findById(id);
        if (developer && developer.author.toString() === req.session.userId) {
            await Developer.findByIdAndDelete(id);
            req.flash('success_msg', 'Profil başarıyla silindi.');
        }
        res.redirect("/developers");
    } catch (error) {
        console.error("Silme sırasında hata:", error);
        res.redirect("/developers");
    }
});

module.exports = router;