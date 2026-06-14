import React from "react";

/**
 * @param {{
 *   suraName      : string,
 *   ayahNumber    : number|string,
 *   onContinue    : Function,
 *   ayah          : object|null,
 *   ayahLoading   : boolean,
 * }} props
 */
const BottomCards = ({ suraName, ayahNumber, onContinue, ayah, ayahLoading }) => (
  <div className="home__bottom-grid">

    {/* ── Reading Card ── */}
    <div className="home__card">
      <div className="home__card-title">
        <span style={{ color: "#c8960c" }}>📖</span> تابع القراءة
      </div>
      <div className="home__card-book-icon">📗</div>
      <div className="home__card-main">{suraName}</div>
      <div className="home__card-sub">الآية {ayahNumber}</div>
      <button className="home__card-btn" onClick={onContinue}>
        متابعة
      </button>
    </div>

    {/* ── Ayah of the Day Card ── */}
    <div className="home__card">
      <div className="home__card-title">
        <span style={{ color: "#c8960c" }}>✨</span> آية اليوم
      </div>
      <div className="home__quote-icon">❝</div>

      {ayahLoading ? (
        <div className="home__ayah-text home__ayah-loading">جاري التحميل...</div>
      ) : (
        <>
          <div className="home__ayah-text">
            {ayah?.text || "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"}
          </div>
          <div className="home__ayah-ref">
            {ayah?.surah || "الشرح"} {ayah?.ayahNumber || "5-6"}
          </div>
          <div className="home__ayah-tafsir">
            <span className="home__tafsir-label">التفسير:</span>{" "}
            {ayah?.tafsir || "التفسير غير متاح"}
          </div>
        </>
      )}
    </div>

  </div>
);

export default BottomCards;
