// 1) Express kütüphanesini projeye dahil ediyoruz.
const express = require('express'); 

// 2) Express'ten bir uygulama (sunucu) örneği oluşturuyoruz.
const app = express();

// 3) Sunucumuzun çalışacağı port numarasını belirliyoruz. 
const PORT = 3000;

// 4) Ana dizine (http://localhost:3000/) bir GET isteği geldiğinde ne olacağını tanmlıyoruz.
app.get('/', (req, res) => {
    res.send('proje havuzu sunucu çalışıyor');
})

// 5) Sunucuyu belirlediğimiz portta dinlemeye başlıyoruz.
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
})