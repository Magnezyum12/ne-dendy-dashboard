# Ne Dendy? Yönetici Paneli 🚀

Bu proje, Datafors Frontend Case çalışması kapsamında hazırlanmıştır. "Ne Dendy?" modülünün anket verilerini analiz eden, yönetici odaklı bir dashboard uygulamasıdır.

## 🛠 Kurulum ve Çalıştırma
1. Projeyi klonlayın: `git clone [REPOLINKI]`
2. Bağımlılıkları yükleyin: `npm install`
3. Uygulamayı başlatın: `npm run dev`

## 🧠 Teknik Kararlar
- **Veri Temizliği:** `confidence = 0` olan satırlar model gürültüsü olarak saptanmış ve istatistiklere dahil edilmemiştir.
- **Risk Analizi:** `risk_flag` takibine ek olarak, `severity > 0.5` olan girdiler de riskli olarak işaretlenmiştir.
- **Duygu Durum Yerelleştirmesi:** Kullanıcı deneyimini artırmak amacıyla İngilizce sentiment verileri Türkçeye çevrilmiştir.
