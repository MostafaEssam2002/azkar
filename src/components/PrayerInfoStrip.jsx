export default function PrayerInfoStrip({
  selectedCity,
  selectedCountry,
  isAudioMuted,
  countdown,
  COUNTRIES_DATA,
}) {
  const locationLabel = `${selectedCity}، ${COUNTRIES_DATA[selectedCountry]?.name || ''}`;

  return (
    <section className="info-strip">
      <div className="info-strip__item">
        <span className="info-strip__icon">📍</span>
        <div>
          <span className="info-strip__label">الموقع</span>
          <strong>{locationLabel}</strong>
        </div>
      </div>

      <div className="info-strip__divider" />

      <div className="info-strip__item">
        <span className="info-strip__icon">🕋</span>
        <div>
          <span className="info-strip__label">الاتجاه</span>
          <strong>قبلة</strong>
        </div>
      </div>

      <div className="info-strip__divider" />

      <div className="info-strip__item">
        <span className="info-strip__icon">{isAudioMuted ? '🔕' : '🔔'}</span>
        <div>
          <span className="info-strip__label">الأذان</span>
          <strong>{isAudioMuted ? 'مُعطّل' : 'مُفعّل'}</strong>
        </div>
      </div>

      <div className="info-strip__divider" />

      <div className="info-strip__item info-strip__item--countdown">
        <span className="info-strip__icon">⏰</span>
        <div>
          <span className="info-strip__label">حتى الأذان</span>
          <strong>{countdown}</strong>
        </div>
      </div>
    </section>
  );
}
