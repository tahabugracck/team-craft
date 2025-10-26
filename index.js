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
app.use(express.static('public')); // statik dosyaları (css, resimler vb.) için 'public' klasörünü kullan

// --- ROTALAR (ROUTES) ---

// Ana sayfayı (profil ekleme formu) göster
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Yeni bir geliştirici ekle (POST)
app.post('/add-developer', (req, res) => {
    const developer = new Developer({
        name: req.body.developerName,
        skills: req.body.developerSkills,
        linkedin: req.body.developerLinkedin
    });
    developer.save()
    .then((result) => {res.redirect('/developers').catch(err => console.log(err));
});
});

// Tüm geliştiricileri listele (GET)
app.get('/developers', (req, res) => {
    Developer.find().sort({ createdAt: -1})
    .then((result) => { // 'developers.ejs' dosyasını render et ve ona 'developers' adında bir değişken gönder.
        res.render('developers', { developers: result}); // bu değişkenin değeri veritabanından gelen 'result' olacak
    })
    .catch(err => console.log(err));
});

// Tek bir geliştiricinin detay sayfasını göster (GET)
app.get('/developers/:id', (req, res) => {
    const id = req.params.id; // URL'den gelen id'yi al
    Developer.findById(id)
    .then(result => {
        res.render('details', { developer: result}); 
    });
});

// Bir geliştiriciyi sil (POST)
app.post('/developers/delete/:id', (req, res) => {
    const id = req.params.id;
    Developer.findByIdAndDelete(id)
    .then(result => {
        res.redirect('/developers');
    })
    .catch(err => console.log(err));
});

// Düzenleme sayfasını göster (GET)
app.get('/developers/edit/:id', (req, res) => {
  const id = req.params.id;
  Developer.findById(id)
    .then(result => {
      res.render('edit', { developer: result });
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('Profil bulunamadı');
    });
});

// Bir profili güncelle (POST)
app.post('/developers/update/:id', (req, res) => {
  const id = req.params.id;

  // 1. Formdan gelen veriyi, veritabanı şemamıza uygun yeni bir objeye aktar.
  const updatedData = {
    name: req.body.developerName,
    skills: req.body.developerSkills,
    linkedin: req.body.developerLinkedin
  };

  // 2. findByIdAndUpdate metoduna req.body yerine bu yeni ve doğru objeyi gönder.
  Developer.findByIdAndUpdate(id, updatedData, { new: true })
    .then(result => {
      res.redirect(`/developers/${result._id}`);
    })
    .catch(err => console.log(err));
});