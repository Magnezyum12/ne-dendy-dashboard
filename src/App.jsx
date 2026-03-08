import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LayoutDashboard, Filter, BarChart3, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState('all');
  const [rawCount, setRawCount] = useState(0);

  useEffect(() => {
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const raw = results.data;
        setRawCount(raw.length);

        // --- DAHA ESNEK VE GÜVENLİ FİLTRELEME ---
        const cleanData = raw.filter(item => {
          // Değerleri temizle (boşlukları at, küçük harf yap)
          const displayVal = String(item.should_display || "").toLowerCase().trim();
          const confVal = Number(item.confidence || 0);

          // Esnek kontrol: 'true', 't' veya '1' değerlerinden herhangi birini kabul et
          const isDisplayTrue = (displayVal === 'true' || displayVal === 't' || displayVal === '1');
          const hasConfidence = confVal > 0;

          return isDisplayTrue && hasConfidence;
        });

        console.log("Ham Veri:", raw.length, "Filtrelenmiş Veri:", cleanData.length);
        
        setData(cleanData);
        setFilteredData(cleanData);
      },
    });
  }, []);

  useEffect(() => {
    if (selectedSurveyId === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.survey_id === selectedSurveyId));
    }
  }, [selectedSurveyId, data]);

  const surveyIds = [...new Set(data.map(item => item.survey_id))].filter(Boolean);

  const isRisk = (row) => {
    const flag = String(row.risk_flag || "").toLowerCase().trim();
    const severity = Number(row.severity || 0);
    return flag === 't' || flag === 'true' || flag === '1' || severity > 0.5;
  };

  const translateSentiment = (sentiment) => {
    const s = String(sentiment || "").toLowerCase().trim();
    if (s === 'positive') return 'Pozitif';
    if (s === 'negative') return 'Negatif';
    return 'Nötr';
  };

  const totalResponses = filteredData.length;
  const riskCount = filteredData.filter(row => isRisk(row)).length;
  
  const avgScore = totalResponses > 0 
    ? (filteredData.reduce((acc, curr) => acc + Number(curr.score || 0), 0) / totalResponses).toFixed(2) 
    : "0.00";

  // Güven skoru 0-1 arasındaysa 100 ile çarp, zaten 0-100 arasındaysa olduğu gibi bırak
  const calculateAvgConf = () => {
    if (totalResponses === 0) return 0;
    const sum = filteredData.reduce((acc, curr) => acc + Number(curr.confidence || 0), 0);
    const avg = sum / totalResponses;
    return avg <= 1 ? Math.round(avg * 100) : Math.round(avg);
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        
        <header style={headerStyle}>
          <div style={logoWrapperStyle}>
            <LayoutDashboard size={45} color="white" />
          </div>
          <h1 style={titleStyle}>Ne Dendy? Yönetici Paneli</h1>
          <p style={{ color: '#e0f2f1', fontWeight: '500', marginTop: '10px' }}>
            Analiz Edilen Veri: {totalResponses} / Toplam Kayıt: {rawCount}
          </p>
        </header>

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
            <div><div style={cardLabelStyle}>Model Güveni</div><div style={cardValueStyle}>%{calculateAvgConf()}</div></div>
          </div>
        </div>

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
                {filteredData.slice(0, 50).map((row, index) => {
                  const conf = Number(row.confidence || 0);
                  const displayConf = conf <= 1 ? Math.round(conf * 100) : Math.round(conf);
                  return (
                    <tr key={index} style={trStyle}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: '600', color: '#1a202c' }}>{row.summary || "Veri Yok"}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Anket ID: {row.survey_id} | Güven: %{displayConf}</div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ 
                          fontWeight: '600',
                          color: String(row.sentiment || "").toLowerCase().includes('pos') ? '#16a34a' : String(row.sentiment || "").toLowerCase().includes('neg') ? '#dc2626' : '#64748b' 
                        }}>
                          {translateSentiment(row.sentiment)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {isRisk(row) ? <span style={riskBadgeStyle}>RİSKLİ</span> : <span style={safeBadgeStyle}>GÜVENLİ</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stil Tanımlamaları
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