import { useContext } from "react";
// Components
import PrayerHeader from './../components/prayer/PrayerHeader';
import AthanSettings from './../components/prayer/AthanSettings';
import NextPrayerCard from './../components/prayer/NextPrayerCard';
import DateBar from './../components/prayer/DateBar';
import PrayersGrid from './../components/prayer/PrayersGrid';
import QuranCard from './../components/prayer/QuranCard';

// Context
import { PrayerContext } from "../components/prayer/PrayerContext";
import { COUNTRIES_DATA } from "../utils/constants";

// Constants



export default function PrayerTimes() {
  const prayerData = useContext(PrayerContext);

  if (!prayerData) {
    return <div>جاري التحميل...</div>;
  }

  const {
    prayerTimes,
    gregDate,
    hijriDate,
    nextPrayer,
    countdown,
    ringOffset,
    error,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity
  } = prayerData;

  const circumference = 2 * Math.PI * 30;

  return (
    <div className="prayer-app">
      {/* ── FULL-SCREEN BACKGROUND IMAGE ── */}
      <div className="prayer-app__bg">
        <img
          src="/prayer.png"
          alt="mosque background"
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* ── SCROLLABLE CONTENT OVER BACKGROUND ── */}
      <div className="page-scroll">
        <div className="page-container">
          {/* Hero Header */}
          <PrayerHeader
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            COUNTRIES_DATA={COUNTRIES_DATA}
          />

          {/* Athan Settings (country / city / muezzin voice) */}
          <div style={{ textAlign: 'center' }}>
            <AthanSettings
              selectedCountry={selectedCountry}
              selectedCity={selectedCity}
              COUNTRIES_DATA={COUNTRIES_DATA}
              onCountryChange={setSelectedCountry}
              onCityChange={setSelectedCity}
            />
          </div>

          {/* Next Prayer Card */}
          <NextPrayerCard
            nextPrayer={nextPrayer}
            prayerTimes={prayerTimes}
            countdown={countdown}
            ringOffset={ringOffset}
          />

          {/* ── CONTENT ── */}
          <div className="content">

            {/* Date Bar */}
            <DateBar
              gregDate={gregDate}
              hijriDate={hijriDate}
            />

            {/* Prayers Grid */}
            <PrayersGrid
              prayerTimes={prayerTimes}
              nextPrayer={nextPrayer}
              error={error}
            />

            {/* Quran Card */}
            <QuranCard />
          </div>
        </div>
      </div>
    </div>
  );
}