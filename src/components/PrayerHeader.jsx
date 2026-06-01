export default function PrayerHeader({ selectedCountry, selectedCity, COUNTRIES_DATA }) {
  return (
    <div className="hero-header">
      <div className="hero-header__title">مواقيت الصلاة 🌙</div>
      <div className="hero-header__subtitle">
        {selectedCity}، {COUNTRIES_DATA[selectedCountry]?.name}
      </div>
    </div>
  );
}
