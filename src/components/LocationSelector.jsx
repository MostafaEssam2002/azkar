export default function LocationSelector({
  selectedCountry,
  selectedCity,
  COUNTRIES_DATA,
  onCountryChange,
  onCityChange
}) {
  return (
    <div className="location-selector">
      <div className="location-selector__group">
        <label htmlFor="country-select" className="location-selector__label">
          الدولة
        </label>
        <select
          id="country-select"
          className="location-selector__select"
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

      <div className="location-selector__group">
        <label htmlFor="city-select" className="location-selector__label">
          المدينة
        </label>
        <select
          id="city-select"
          className="location-selector__select"
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
  );
}
