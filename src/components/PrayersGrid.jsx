import { PRAYERS_AR, PRAYER_ICONS, KEYS } from '../utils/constants';

export default function PrayersGrid({ prayerTimes, nextPrayer, error }) {
  const format12Hour = (str) => {
    const [h, m] = str.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')}${period}`;
  };

  return (
    <div className="prayers-grid">
      {error && (
        <div className="status-error" style={{ gridColumn: 'span 3' }}>
          تعذر تحميل المواقيت
        </div>
      )}
      {Object.keys(prayerTimes).length === 0 && !error && (
        <div className="status-loading" style={{ gridColumn: 'span 3' }}>
          جاري تحميل مواقيت الصلاة...
        </div>
      )}
      {KEYS.map((k) => {
        if (!prayerTimes[k]) return null;
        const isNext = nextPrayer && k === nextPrayer.key;
        return (
          <div
            key={k}
            className={`prayer-card${isNext ? ' prayer-card--active' : ''}`}
          >
            <div className="prayer-card__icon">{PRAYER_ICONS[k]}</div>
            <div className="prayer-card__name">
              {isNext && <span className="prayer-card__dot" />}
              {PRAYERS_AR[k]}
            </div>
            <div className="prayer-card__time">{format12Hour(prayerTimes[k])}</div>
            {isNext && <span className="prayer-card__badge">القادمة</span>}
          </div>
        );
      })}
    </div>
  );
}
