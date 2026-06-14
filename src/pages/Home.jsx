import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { PrayerContext } from "../components/PrayerContext";
import { PRAYERS_AR }    from "../utils/constants";
import chaptersData       from "../data/chapters.json";

// ── Hooks ────────────────────────────────────────────────────────────────────
import useWirdProgress  from "../hooks/useWirdProgress";
import useAzkarProgress from "../hooks/useAzkarProgress";
import useRandomAyah    from "../hooks/useRandomAyah";

// ── Sub-components ───────────────────────────────────────────────────────────
import HeroSection    from "../components/home/HeroSection";
import QuickAccess    from "../components/home/QuickAccess";
import PrayerProgress from "../components/home/PrayerProgress";
import BottomCards    from "../components/home/BottomCards";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const format12Hour = (timeStr) => {
  if (!timeStr || timeStr === "--:--") return "--:--";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

const Home = () => {
  const navigate   = useNavigate();
  const prayerData = useContext(PrayerContext);

  // ── Local state ────────────────────────────────────────────────────────────
  const [quranPin,        setQuranPin]        = useState(null);
  const [readingProgress, setReadingProgress] = useState({ currentSura: 1 });

  // ── Custom hooks ───────────────────────────────────────────────────────────
  const wirdProgress = useWirdProgress();
  const { azkarType, completed: azkarCompleted, total: azkarTotal } =
    useAzkarProgress(prayerData?.prayerTimes);
  const { ayah, loading: ayahLoading } = useRandomAyah();

  // ── Quran pin & reading progress ──────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quran_pin");
      if (saved) setQuranPin(JSON.parse(saved));

      const readingData = localStorage.getItem("reading_progress");
      setReadingProgress(readingData ? JSON.parse(readingData) : { currentSura: 1 });
    } catch (err) {
      console.error("Home: localStorage read error", err);
      setReadingProgress({ currentSura: 1 });
    }
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const nextPrayerName = prayerData?.nextPrayer?.key
    ? PRAYERS_AR[prayerData.nextPrayer.key]
    : "الصلاة القادمة";

  const nextPrayerTime =
    prayerData?.nextPrayer?.key && prayerData?.prayerTimes
      ? format12Hour(prayerData.prayerTimes[prayerData.nextPrayer.key] || "--:--")
      : "--:--";

  const countdown = prayerData?.countdown || "--:--:--";

  const getCurrentSuraName = () => {
    const suraId  = quranPin?.suraId || readingProgress?.currentSura || 1;
    const chapter = chaptersData.chapters.find((c) => c.id === suraId);
    return chapter?.name_arabic || "الفاتحة";
  };

  const getCurrentAyahNumber = () => quranPin?.ayaNumber || 1;

  const handleGoToPin = () => {
    if (quranPin) localStorage.setItem("shouldJumpToPin", "true");
    navigate("/quran");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="home">

      <HeroSection
        onQuranClick ={() => navigate("/quran")}
        onAdhkarClick={() => navigate("/azkar")}
      />

      <div className="home__content">

        <QuickAccess />

        <PrayerProgress
          nextPrayerName={nextPrayerName}
          nextPrayerTime={nextPrayerTime}
          countdown={countdown}
          azkarType={azkarType}
          azkarCompleted={azkarCompleted}
          azkarTotal={azkarTotal}
          wirdPercentage={wirdProgress.percentage}
          wirdPart={wirdProgress.part}
        />

        <BottomCards
          suraName   ={getCurrentSuraName()}
          ayahNumber ={getCurrentAyahNumber()}
          onContinue ={handleGoToPin}
          ayah       ={ayah}
          ayahLoading={ayahLoading}
        />

      </div>
    </div>
  );
};

export default Home;
