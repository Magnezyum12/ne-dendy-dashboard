# Ne Dendy? Yönetici Paneli 🚀

Bu proje, **Datafors Frontend Case** çalışması kapsamında geliştirilmiştir. "Ne Dendy?" modülünden gelen ham anket verilerini analiz eden, veri temizliği ve anlamlandırma süreçlerini içeren yönetici odaklı bir dashboard uygulamasıdır.

---

## 🛠 Kurulum ve Çalıştırma
1. **Projeyi klonlayın:** `git clone https://github.com/Magnezyum12/ne-dendy-dashboard`
2. **Bağımlılıkları yükleyin:** `npm install`
3. **Uygulamayı başlatın:** `npm run dev`

---

## 🧠 Veri Analizi ve Mühendislik Kararları

Proje, sadece bir arayüz çalışması değil, aynı zamanda verinin güvenilirliğini sorgulayan bir **Keşifçi Veri Analizi** sürecini kapsamaktadır.

### 1. Veri Filtreleme Stratejisi
Ham veri seti **1369** kayıt içermesine rağmen, dashboard üzerinde sadece **232** kayıt aktif olarak işlenmektedir. Bu seçimin arkasındaki teknik mantık:

* **`should_display` Analizi:** Sistem tarafından görüntülenmesi uygun görülmeyen (`False`) tüm veriler, raporlama doğruluğu adına elenmiştir.
* **Mantıksal Korelasyon:** Yapılan incelemede, `confidence = 0.00` olan her verinin istisnasız `should_display = False` olduğu saptanmıştır. Ancak, güven skoru yüksek olup yine de "False" işaretlenen veriler de tespit edilmiş; bu durumda sistemin kararı önceliklendirilmiştir.
* **İstatistiki Sonuç:** Analizler (**Ortalama Skor: 0.38**, **Model Güveni: %86**) sadece bu yüksek kaliteli 232 kayıt üzerinden hesaplanarak yanıltıcı gürültü verilerin istatistikleri bozması engellenmiştir.

### 2. Risk ve Duygu Analizi
* **Hibrit Risk Takibi:** Verideki `risk_flag` takibine ek olarak, `severity > 0.5` olan girdiler de proaktif bir yaklaşımla "Riskli" kategorisine alınmıştır.
* **Yerelleştirme:** Operasyonel verimlilik ve kullanıcı deneyimi için İngilizce `sentiment` verileri Türkçeye çevrilerek sunulmuştur.

---

## 🚀 Gelecek Vizyonu ve İyileştirmeler
* **Dinamik Veri Filtreleme:** Kullanıcıların dashboard üzerinden `confidence` ve `severity` eşik değerlerini anlık olarak değiştirebileceği kaydırıcılar eklenmesi.
* **Görsel Veri Ayrıştırma:** Mevcut listede yer alan ancak güven değeri düşük olan verilerin, operasyonel şeffaflık adına tabloda görsel olarak (örneğin gri tonlama veya uyarı ikonu ile) ayrıştırılması.
* **İleri Analitik Modu:** `confidence = 0` olan verilerin nedenlerini (veri eksikliği mi yoksa model hatası mı?) analiz eden ek bir teşhis paneli.

## Zaman yetseydi, python notebook'undaki veri analizleri, işlemleri ve açıklamaları daha detaylı ve anlaşılabilir hale getirebilirdim.
