import { useState, useRef, useEffect } from 'react';
// import './AthanSettings.css';

// أسماء ملفات الأذان الموجودة في public/audio/
// الملف الأول هو الأذان الافتراضي المستخدم حاليًا في التطبيق
export const MUEZZIN_LIST = [
  { id: 'default', name: 'الأذان الافتراضي', file: 'azan.mp3' },
  { id: 'mishary', name: 'مشاري راشد العفاسي', file: 'Mishary Rashid Alafasy.mp3' },
  { id: 'nafees', name: 'أحمد النفيس', file: 'Ahmad al-Nafees.mp3' },
  { id: 'hafiz', name: 'حافظ مصطفى', file: 'Hafiz Mustafa.mp3' },
  { id: 'naqshabandi', name: 'النقشبندي', file: 'النقشبندي.mp3' },
  { id: 'baafif', name: 'عبدالله با عفيف', file: 'عبدالله با عفيف.mp3' },
  { id: 'ali-mulla', name: 'علي ملا', file: 'علي ملا.mp3' },
  { id: 'marwan-qassas', name: 'مروان قصاص', file: 'مروان قصاص.mp3' },
];

export const MUEZZIN_STORAGE_KEY = 'selectedMuezzin';

export default function AthanSettings({
  selectedCountry,
  selectedCity,
  COUNTRIES_DATA,
  onCountryChange,
  onCityChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMuezzinId, setSelectedMuezzinId] = useState('default');
  const [previewingId, setPreviewingId] = useState(null);
  const audioRef = useRef(null);

  // تحميل المؤذن المحفوظ مسبقًا عند فتح التطبيق
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MUEZZIN_STORAGE_KEY));
      if (saved?.id) {
        setSelectedMuezzinId(saved.id);
      }
    } catch {
      // تجاهل أي بيانات تالفة في localStorage
    }
  }, []);

  // إيقاف أي معاينة صوت عند إغلاق النافذة
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPreviewingId(null);
    }
  }, [isOpen]);

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPreviewingId(null);
  };

  // تشغيل/إيقاف معاينة صوت الأذان عند الضغط على اسم القارئ
  const playPreview = (muezzin) => {
    if (previewingId === muezzin.id) {
      stopPreview();
      return;
    }
    stopPreview();
    const audio = new Audio(encodeURI(`/audio/${muezzin.file}`));
    audioRef.current = audio;
    setPreviewingId(muezzin.id);
    audio.addEventListener('ended', () => {
      setPreviewingId(null);
      audioRef.current = null;
    });
    audio.play().catch((err) => {
      console.warn('تعذر تشغيل معاينة الصوت:', err);
      setPreviewingId(null);
      audioRef.current = null;
    });
  };

  // حفظ القارئ المختار في localStorage عند الضغط على المربع
  const selectMuezzin = (muezzin) => {
    setSelectedMuezzinId(muezzin.id);
    localStorage.setItem(
      MUEZZIN_STORAGE_KEY,
      JSON.stringify({ id: muezzin.id, file: muezzin.file, name: muezzin.name })
    );
  };

  return (
    <>
      <button
        type="button"
        className="athan-settings__trigger"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        <span className="athan-settings__trigger-icon">⚙️</span>
        إعدادات الأذان
      </button>

      {isOpen && (
        <div 
          className="athan-settings__overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div className="athan-settings__modal" onClick={(e) => e.stopPropagation()}>
            <div className="athan-settings__header">
              <h3 className="athan-settings__title">إعدادات الأذان</h3>
              <button
                type="button"
                className="athan-settings__close"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="athan-settings__body">
              <section className="athan-settings__section">
                <div className="athan-settings__section-title">الموقع</div>
                <div className="athan-settings__location-row">
                  <div className="athan-settings__field">
                    <label htmlFor="athan-country-select">الدولة</label>
                    <select
                      id="athan-country-select"
                      value={selectedCountry}
                      onChange={(e) => {
                        onCountryChange(e.target.value);
                        const firstCity = COUNTRIES_DATA[e.target.value].cities[0];
                        onCityChange(firstCity);
                      }}
                    >
                      {Object.entries(COUNTRIES_DATA).map(([code, data]) => (
                        <option key={code} value={code}>
                          {data.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="athan-settings__field">
                    <label htmlFor="athan-city-select">المدينة</label>
                    <select
                      id="athan-city-select"
                      value={selectedCity}
                      onChange={(e) => onCityChange(e.target.value)}
                    >
                      {COUNTRIES_DATA[selectedCountry]?.cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="athan-settings__section">
                <div className="athan-settings__section-title">صوت المؤذن</div>
                <p className="athan-settings__hint">
                  اضغط على اسم القارئ للاستماع لتجربة الصوت، وفعّل المربع لاختياره وحفظه
                </p>

                <ul className="athan-settings__list">
                  {MUEZZIN_LIST.map((muezzin) => {
                    const isSelected = selectedMuezzinId === muezzin.id;
                    const isPreviewing = previewingId === muezzin.id;
                    return (
                      <li
                        key={muezzin.id}
                        className={`athan-settings__item${isSelected ? ' athan-settings__item--selected' : ''}`}
                      >
                        <button
                          type="button"
                          className="athan-settings__name-btn"
                          onClick={() => playPreview(muezzin)}
                        >
                          <span className="athan-settings__play-icon">
                            {isPreviewing ? '⏸' : '▶'}
                          </span>
                          <span>{muezzin.name}</span>
                        </button>

                        <input
                          type="checkbox"
                          className="athan-settings__checkbox"
                          checked={isSelected}
                          onChange={() => selectMuezzin(muezzin)}
                          aria-label={`اختيار صوت ${muezzin.name}`}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>

            <button type="button" className="athan-settings__done-btn" onClick={() => setIsOpen(false)}>
              تم
            </button>
          </div>
        </div>
      )}
    </>
  );
}
