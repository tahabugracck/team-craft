const express = require('express');
const path = require('path'); // path modülünü dahil ettik

const app = express();
const PORT = 3000;

// Middleware: Gelen form verilerini (urlencoded) parse etmek için.
// Bu satır olmadan formdan gelen veriyi 'req.body' içinde göremeyiz!
app.use(express.urlencoded({ extended: true }));

// Ana dizine (/) bir GET isteği geldiğinde index.html dosyasını gönder.
app.get('/', (req, res) => {
  // path.join ile işletim sisteminden bağımsız doğru dosya yolunu oluşturuyoruz.
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// '/add-developer' adresine bir POST isteği geldiğinde çalışacak kod.
app.post('/add-developer', (req, res) => {
  // Formdan gelen veriler express.urlencoded middleware'i sayesinde req.body objesinde toplanır.
  const profileData = req.body;

  // 1. Gelen veriyi terminalde görelim (test için).
  console.log('Yeni profil verisi alındı:', profileData);

  // 2. Kullanıcıya verinin alındığına dair bir geri bildirim gösterelim.
  res.send(`
    <h1>Profil Alındı!</h1>
    <p><strong>İsim:</strong> ${profileData.developerName}</p>
    <p><strong>Yetenekler:</strong> ${profileData.developerSkills}</p>
    <p><strong>LinkedIn:</strong> ${profileData.developerLinkedin}</p>
    <a href="/">Yeni Profil Ekle</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});