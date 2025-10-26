const express = require('express');
const path = require('path');
const fs = require('fs'); // Node.js'in dosya sistemi modülü

const app = express();
const PORT = 3000;

// veritabanı dosyamızın yolunu bir değişkene atama
const dbFilePath = path.join(__dirname, 'data', 'developers.json');

app.use(express.urlencoded({ extended: true }));

// ana sayfayı (profil ekleme formu) göster
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// yeni bir geliştirici profili eklendiğinde çalışacak POST metodu
app.post('/add-developer', (req, res) => {
  // 1) mevcut veritabanı dosyasını oku.
  const developers = JSON.parse(fs.readFileSync(dbFilePath));

  // 2) formdan gelen yeni veriyi al.
  const newDeveloper = {
    id: Date.now(), 
    name: req.body.developerName,
    skills: req.body.developerSkills,
    linkedin: req.body.developerLinkedin
  };

  // 3) yeni veriyi mevcut listenin sonuna ekle.
  developers.push(newDeveloper);

  // 4) güncel listeyi tekrar dosyaya yaz. (JSON formatında)
  fs.writeFileSync(dbFilePath, JSON.stringify(developers, null, 2));   // null, 2 -> Dosyayı daha okunaklı formatlaması için.

  // 5) işlem bittikten sonra kullanıcıyı profillerin listelendiği sayfaya yönlendir.
  res.redirect('/developers');
});

// tüm geliştiricileri listeleyecek sayfa
app.get('/developers', (req, res) => {
    // 1) veritabanı dosyasını oku
    const developers = JSON.parse(fs.readFileSync(dbFilePath));

    // 2) her bir developer için bir HTML list item (<li>) oluştur
    let html = '<h1>Kayıtlı Geliştiriciler</h1><ul>';
    html += '<u1>';
    for (const dev of developers) {
        html += '<li>${dev.name} - Yetenekler: ${dev.skills}</li>';
    }
    html += '</ul>';
    html += '<a href="/">Yeni Profil Ekle</a>';
        
    // 3) oluşturulan HTML'i kullanıcıya gönder
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});
    
