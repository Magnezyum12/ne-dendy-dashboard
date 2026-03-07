import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LayoutDashboard, Filter, BarChart3, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';

function App() {
  // --- State Yönetimi ---
  const [data, setData] = useState([]); // CSV'den gelen ham veri
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş ve ekranda gösterilen veri
  const [selectedSurveyId, setSelectedSurveyId] = useState('all'); // Dropdown filtre seçimi

  // --- Veri Çekme (Data Fetching) ---
  useEffect(() => {
    // Public klasöründeki data.csv dosyasını PapaParse ile JSON'a dönüştürüyoruz
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        setFilteredData(results.data);
      },
    });
  }, []);

  // --- Filtreleme Mantığı ---
  useEffect(() => {
    // survey_id değiştiğinde listeyi güncelliyoruz
    if (selectedSurveyId === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.survey_id === selectedSurveyId));
    }
  }, [selectedSurveyId, data]);

  // Benzersiz Survey ID'lerini dropdown için hazırlıyoruz
  const surveyIds = [...new Set(data.map(item => item.survey_id))].filter(Boolean);

  // --- Yardımcı Fonksiyonlar ---
  
  /**
   * Bir satırın risk teşkil edip etmediğini belirler.
   * Mantık: risk_flag 't' ise VEYA severity (şiddet) 0.5 üzerindeyse riskli kabul edilir.
   */
  const isRisk = (row) => {
    const flag = String(row.risk_flag).toLowerCase();
    const severity = Number(row.severity || 0);
    return flag === 't' || flag === 'true' || flag === '1' || severity > 0.5;
  };

  /**
   * İngilizce gelen duygu durumlarını Türkçeye çevirir.
   */
  const translateSentiment = (sentiment) => {
    const s = String(sentiment).toLowerCase();
    if (s === 'positive') return 'Pozitif';
    if (s === 'negative') return 'Negatif';
    return 'Nötr';
  };

  // --- Analitik Hesaplamalar ---
  const totalResponses = filteredData.length;
  const riskCount = filteredData.filter(row => isRisk(row)).length;
  
  // Ortalama Skor: 0.00 değerleri düşük performansı temsil ettiği için hesaplamaya dahildir.
  const avgScore = totalResponses > 0 
    ? (filteredData.reduce((acc, curr) => acc + Number(curr.score || 0), 0) / totalResponses).toFixed(2) 
    : "0.00";

  // Model Güveni: 0.00 değerleri analiz dışı gürültü (noise) olduğu için filtrelenmiştir.
  const validConfidences = filteredData.map(d => Number(d.confidence)).filter(c => c > 0);
  const avgConfidence = validConfidences.length > 0
    ? (validConfidences.reduce((a, b) => a + b, 0) / validConfidences.length).toFixed(2)
    : "0.00";

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        
        {/* Başlık ve Logo Bölümü */}
        <header style={headerStyle}>
          <div style={logoWrapperStyle}>
            <LayoutDashboard size={45} color="white" />
          </div>
          <h1 style={titleStyle}>Ne Dendy? Yönetici Paneli</h1>
        </header>

        {/* Üst İstatistik Kartları */}
        <div style={statsGridStyle}>
          <div style={cardStyle}>
            <div style={iconContainerStyle}><BarChart3 size={22} color="#19a898"/></div>
            <div><div style={cardLabelStyle}>Toplam Yanıt</div><div style={cardValueStyle}>{totalResponses}</div></div>
          </div>
          <div style={cardStyle}>
            <div style={{...iconContainerStyle, backgroundColor: '#fff5f5'}}><ShieldAlert size={22} color="#e53e3e"/></div>
            <div><div style={cardLabelStyle}>Riskli Yanıtlar</div><div style={cardValueStyle}>{riskCount}</div></div>
          </div>
          <div style={cardStyle}>
            <div style={{...iconContainerStyle, backgroundColor: '#ebf8ff'}}><CheckCircle size={22} color="#3182ce"/></div>
            <div><div style={cardLabelStyle}>Ortalama Skor</div><div style={cardValueStyle}>{avgScore}</div></div>
          </div>
          <div style={cardStyle}>
            <div style={{...iconContainerStyle, backgroundColor: '#f5f3ff'}}><AlertCircle size={22} color="#7c3aed"/></div>
            <div><div style={cardLabelStyle}>Model Güveni</div><div style={cardValueStyle}>%{Math.round(avgConfidence * 100)}</div></div>
          </div>
        </div>

        {/* Veri Tablosu ve Filtreleme Alanı */}
        <div style={tableWrapperStyle}>
          <div style={filterHeaderStyle}>
             <Filter size={20} color="#4a5568" />
             <label style={{ fontWeight: '700', color: '#2d3748' }}>Anket Seçin:</label>
             <select onChange={(e) => setSelectedSurveyId(e.target.value)} style={selectStyle}>
                <option value="all">Tüm Anketler</option>
                {surveyIds.map(id => <option key={id} value={id}>{id}</option>)}
             </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={thStyle}>Analiz Özeti</th>
                  <th style={thStyle}>Duygu Durumu</th>
                  <th style={thStyle}>Risk Durumu</th>
                </tr>
              </thead>
              <tbody>
                {/* Performans için ilk 50 kaydı listeliyoruz */}
                {filteredData.slice(0, 50).map((row, index) => (
                  <tr key={index} style={trStyle}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: '600', color: '#1a202c' }}>{row.summary || "Veri Yok"}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Anket ID: {row.survey_id}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ 
                        fontWeight: '600',
                        color: String(row.sentiment).toLowerCase() === 'positive' ? '#16a34a' : String(row.sentiment).toLowerCase() === 'negative' ? '#dc2626' : '#64748b' 
                      }}>
                        {translateSentiment(row.sentiment)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {isRisk(row) ? <span style={riskBadgeStyle}>RİSKLİ</span> : <span style={safeBadgeStyle}>GÜVENLİ</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Stil Tanımlamaları ---
const containerStyle = { backgroundColor: '#19a898', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', boxSizing: 'border-box', margin: 0 };
const contentWrapperStyle = { width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column' };
const headerStyle = { textAlign: 'center', marginBottom: '50px' };
const logoWrapperStyle = { backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '50%', width: 'fit-content', margin: '0 auto 20px auto' };
const titleStyle = { fontSize: '3rem', fontWeight: '900', color: 'white', margin: 0, fontFamily: '"Figtree", sans-serif', letterSpacing: '-0.03em' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const iconContainerStyle = { backgroundColor: '#f0fff4', padding: '10px', borderRadius: '10px' };
const cardLabelStyle = { fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' };
const cardValueStyle = { fontSize: '22px', fontWeight: '800', color: '#1a202c' };
const tableWrapperStyle = { backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' };
const filterHeaderStyle = { marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' };
const selectStyle = { padding: '10px 15px', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#4a5568', borderBottom: '2px solid #edf2f7', fontSize: '13px', fontWeight: '700' };
const tdStyle = { padding: '15px', textAlign: 'left', fontSize: '14px' };
const trStyle = { borderBottom: '1px solid #f1f5f9' };
const riskBadgeStyle = { color: '#dc2626', backgroundColor: '#fef2f2', padding: '5px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' };
const safeBadgeStyle = { color: '#16a34a', backgroundColor: '#f0fdf4', padding: '5px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' };

export default App;