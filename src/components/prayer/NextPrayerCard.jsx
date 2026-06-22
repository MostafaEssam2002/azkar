import { PRAYERS_AR, PRAYER_ICONS } from '../../utils/constants';

export default function NextPrayerCard({
  nextPrayer,
  prayerTimes,
  countdown,
  ringOffset
}) {
  const format12Hour = (str) => {
    const [h, m] = str.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')}${period}`;
  };

  const circumference = 2 * Math.PI * 30;

  if (!nextPrayer) return null;

  return (
    <div className="next-prayer-card">
      {/* Left: name + time */}
      <div>
        <div className="next-prayer-card__label">الصلاة القادمة</div>
        <div className="next-prayer-card__name">
          {PRAYER_ICONS[nextPrayer.key]} {PRAYERS_AR[nextPrayer.key]}
        </div>
        <div className="next-prayer-card__time">
          {format12Hour(prayerTimes[nextPrayer.key] || '00:00')}
        </div>
      </div>

      {/* Center: ring countdown */}
      <div>
        <div className="next-prayer-card__countdown-label">
          متبقى على {PRAYERS_AR[nextPrayer.key]}
        </div>
        <div className="next-prayer-card__ring-wrapper">
          <svg
            className="next-prayer-card__ring-svg"
            width="72"
            height="72"
            viewBox="0 0 72 72"
          >
            <circle className="next-prayer-card__ring-track" cx="36" cy="36" r="30" />
            <circle
              className="next-prayer-card__ring-progress"
              cx="36"
              cy="36"
              r="30"
              strokeDasharray={circumference}
              strokeDashoffset={ringOffset}
            />
          </svg>
          <div className="next-prayer-card__countdown-text">{countdown}</div>
        </div>
      </div>

      {/* Right: bell button */}
      <button className="next-prayer-card__bell-btn">🔔</button>
    </div>
  );
}
