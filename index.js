const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Mongoose'u dahil ettik.

const app = express();

// view engine olarak EJS'i ayarla
app.set('view engine', 'ejs'); // exprees'e ejs views klasöründeki ejs uzantılı dosyalara bak.

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
    Developer.find().sort({ createdAt: -1}).then((result) => { // 'developers.ejs' dosyasını render et ve ona 'developers' adında bir değişken gönder.
        res.render('developers', { developers: result}); // bu değişkenin değeri veritabanından gelen 'result' olacak
    })
    .catch((err) => {
        console.log(err);
        res.send('veriler getirilirken bir hata oluştu');
    });
});
