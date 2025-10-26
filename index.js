const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Mongoose'u dahil ettik.

const app = express();
const PORT = 3000;

// --- MONGODB BAĞLANTISI ---
// Kopyaladığın connection string'i buraya yapıştır. <password> kısmını kendi şifrenle değiştirmeyi unutma!
const dbURI = 'mongodb+srv://teamcraft_user:mySuperSecurePassword123@teamcraftcluster.x3yegjt.mongodb.net/?appName=TeamCraftCluster';

mongoose.connect(dbURI)
  .then((result) => {
    console.log('MongoDB veritabanına başarıyla bağlanıldı.');
    // Bağlantı başarılı olursa sunucuyu başlat.
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
    });
  })
  .catch((err) => console.log(err));

// --- Mongoose Şema ve Model Tanımlaması ---
// Veritabanında 'Developer' koleksiyonunun hangi alanlara sahip olacağını tanımlayan şablon (blueprint).
const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  linkedin: {
    type: String
  }
}, { timestamps: true }); // timestamps: true -> oluşturulma ve güncellenme tarihlerini otomatik ekler.

// Şemayı kullanarak bir Model oluşturuyoruz. Veritabanı işlemleri (kaydet, bul, sil) bu Model üzerinden yapılacak.
const Developer = mongoose.model('Developer', developerSchema);

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));

// --- ROTALAR (ROUTES) ---
// Ana sayfayı (profil ekleme formu) göster
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Yeni bir geliştirici ekle (POST)
app.post('/add-developer', (req, res) => {
  // Modelimizi kullanarak yeni bir döküman oluşturuyoruz.
  const developer = new Developer(
    {
        name: req.body.developerName,
        skills: req.body.developerSkills,
        linkedin: req.body.developerLinkedin
    });

  // Oluşturulan dökümanı veritabanına kaydet.
  developer.save()
    .then((result) => {
      res.redirect('/developers'); // Kayıt başarılıysa listeleme sayfasına yönlendir.
    })
    .catch((err) => {
      console.log(err);
      res.send('Bir hata oluştu.');
    });
});

// Tüm geliştiricileri listele (GET)
app.get('/developers', (req, res) => {
    // Developer modelindeki tüm dökümanları bul ve tarihe göre en yeniden eskiye sırala.
    Developer.find().sort({ createdAt: -1 })
        .then((result) => {
            let html = '<h1>Kayıtlı Geliştiriciler</h1>';
            html += '<ul>';
            for (const dev of result) {
                html += `<li>${dev.name} - Yetenekler: ${dev.skills}</li>`;
            }
            html += '</ul>';
            html += '<a href="/">Yeni Profil Ekle</a>';
            res.send(html);
        })
        .catch((err) => {
            console.log(err);
            res.send('Veriler getirilirken bir hata oluştu.');
        });
});