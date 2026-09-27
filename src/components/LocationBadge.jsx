export default function LocationBadge({ selectedCity, selectedCountry, COUNTRIES_DATA }) {
  return (
    <div className="location-badge">
      <span>📍</span>
      <span>
        {selectedCity}، {COUNTRIES_DATA[selectedCountry]?.name}
      </span>
    </div>
  );
}
