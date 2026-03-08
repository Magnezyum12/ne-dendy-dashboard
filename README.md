Ne Dendy? Yönetici Paneli 🚀
Bu proje, Datafors Frontend Case çalışması kapsamında geliştirilmiştir. "Ne Dendy?" modülünden gelen ham verileri analiz eden, veri temizliği ve anlamlandırma süreçlerini içeren yönetici odaklı bir dashboard uygulamasıdır.

##🛠 Kurulum ve Çalıştırma
Projeyi klonlayın: git clone https://github.com/Magnezyum12/ne-dendy-dashboard

Bağımlılıkları yükleyin: npm install

Uygulamayı başlatın: npm run dev

🧠 Veri Analizi ve Mühendislik Kararları
Proje, sadece bir arayüz çalışması değil, aynı zamanda verinin güvenilirliğini sorgulayan bir Keşifçi Veri Analizi sürecini kapsamaktadır.

1. Veri Filtreleme Stratejisi
Ham veri seti 1369 kayıt içermesine rağmen, dashboard üzerinde sadece 232 kayıt aktif olarak işlenmektedir:

should_display Önceliği: Sistem tarafından "False" işaretlenen veriler, raporlama doğruluğu adına elenmiştir.

Mantıksal Korelasyon: confidence = 0.00 olan her verinin should_display = False olduğu saptanmıştır. Ancak, güven skoru yüksek olup yine de "False" işaretlenen veriler de tespit edilmiş; bu durumda sistemin kararı önceliklendirilmiştir.

İstatistiki Sonuç: Analizler (Ortalama Skor: 0.38, Güven: %86) sadece bu yüksek kaliteli kayıtlar üzerinden hesaplanarak gürültü verilerin istatistikleri bozması engellenmiştir.

2. Risk ve Duygu Analizi
Hibrit Risk Takibi: risk_flag takibine ek olarak, severity > 0.5 olan girdiler de proaktif bir yaklaşımla "Riskli" kategorisine alınmıştır.

Yerelleştirme: Kullanıcı deneyimi için İngilizce sentiment verileri Türkçeye çevrilmiştir.

🚀 Gelecek Vizyonu ve İyileştirmeler
Dinamik Filtreleme: Kullanıcıların confidence ve severity eşik değerlerini anlık olarak değiştirebileceği slider bileşenleri.

Operasyonel Şeffaflık: Düşük güvenli verilerin tabloda tamamen gizlenmek yerine gri tonlama veya uyarı ikonlarıyla ayrıştırılması.

İleri Analitik: confidence = 0 olan kayıtların kök nedenlerini (veri eksikliği/model hatası) analiz eden bir teşhis sekmesi.
