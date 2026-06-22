import { ArrowLeft, BookOpen, Quote, Sparkles } from "lucide-react";

/**
 * @param {{
 *   suraName      : string,
 *   ayahNumber    : number|string,
 *   onContinue    : Function,
 *   ayah          : object|null,
 *   ayahLoading   : boolean,
 * }} props
 */
const BottomCards = ({ suraName, ayahNumber, onContinue, ayah, ayahLoading }) => {
  const progressPercent = Math.min(
    96,
    Math.max(18, Math.round(((Number(ayahNumber) || 1) * 3.2) % 78) + 18)
  );

  return (
    <div className="home__bottom-grid">
      {/* ── Reading Card ── */}
      <div className="home__card home__card--reading">
        <div className="home__card-top-row">
          <div className="home__card-title">
            <BookOpen size={16} />
            <span>تابع القراءة</span>
          </div>
          <span className="home__card-pill">استأنف</span>
        </div>

        <div className="home__reading-layout">
          <div className="home__card-book-icon">
            <BookOpen size={24} />
          </div>
          <div className="home__reading-copy">
            <span className="home__reading-eyebrow">أين توقفت؟</span>
            <div className="home__card-main">{suraName}</div>
            <div className="home__card-sub">الآية {ayahNumber}</div>
          </div>
        </div>

        <div className="home__reading-progress">
          <div className="home__reading-track">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="home__reading-progress-label">{progressPercent}% من القراءة</span>
        </div>

        <button
          className="home__card-btn"
          onClick={onContinue}
          type="button"
          aria-label="متابعة القراءة من الصفحة الحالية"
        >
          متابعة القراءة
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* ── Ayah of the Day Card ── */}
      <div className="home__card home__card--ayah">
        <div className="home__card-top-row">
          <div className="home__card-title">
            <Sparkles size={16} />
            <span>آية اليوم</span>
          </div>
          <div className="home__quote-icon">
            <Quote size={18} />
          </div>
        </div>

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
};

export default BottomCards;
