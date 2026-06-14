import React from "react";
import { useNavigate } from "react-router-dom";
import { AZKAR_TYPES } from "../../utils/azkarStorage";
// import { IconMosque } from "./HomeIcons";
// import { IconMosque } from './../../HomeIcons';
import { IconMosque } from './../../icons/HomeIcons';

/**
 * @param {{
 *   nextPrayerName : string,
 *   nextPrayerTime : string,
 *   countdown      : string,
 *   azkarType      : string,
 *   azkarCompleted : number,
 *   azkarTotal     : number,
 *   wirdPercentage : number,
 *   wirdPart       : number,
 * }} props
 */
const PrayerProgress = ({
  nextPrayerName,
  nextPrayerTime,
  countdown,
  azkarType,
  azkarCompleted,
  azkarTotal,
  wirdPercentage,
  wirdPart,
}) => {
  const navigate = useNavigate();
  const azkarFill = azkarTotal > 0 ? (azkarCompleted / azkarTotal) * 100 : 0;
  const isMorning = azkarType === AZKAR_TYPES.MORNING;

  // الذهاب إلى صفحة الأذكار المناسبة
  const handleAzkarClick = () => {
    if (isMorning) {
      navigate("/azkar/أذكار-الصباح");
    } else {
      navigate("/azkar/أذكار-المساء");
    }
  };

  // الذهاب إلى صفحة الورد اليومي
  const handleWirdClick = () => {
    navigate("/wird");
  };

  return (
    <div className="home__section">
      <div className="home__section-title">تقدم اليوم</div>

      {/* ── Prayer Countdown Card ── */}
      <div className="home__prayer-card">
        <div className="home__prayer-icon-wrap">
          <IconMosque />
        </div>
        <div className="home__prayer-info">
          <div className="home__prayer-next">الصلاة القادمة</div>
          <div className="home__prayer-name">{nextPrayerName}</div>
          <div className="home__prayer-time-label">{nextPrayerTime}</div>
        </div>
        <div className="home__prayer-countdown">{countdown}</div>
      </div>

      {/* ── Progress Bars ── */}
      <div className="home__progress-grid">

        {/* Azkar - Clickable */}
        <div 
          className="home__progress-item home__progress-item--clickable"
          onClick={handleAzkarClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="home__progress-label">
            أذكار {isMorning ? "الصباح" : "المساء"}
          </div>
          <div className="home__progress-value">
            {azkarCompleted} / {azkarTotal}
          </div>
          <div className="home__progress-sub">
            {isMorning ? "من الفجر إلى الظهر" : "من العصر إلى الفجر"}
          </div>
          <div className="home__progress-bar">
            <div className="home__progress-fill" style={{ width: `${azkarFill}%` }} />
          </div>
        </div>

        {/* Wird - Clickable */}
        <div 
          className="home__progress-item home__progress-item--clickable"
          onClick={handleWirdClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="home__progress-label">الورد اليومي</div>
          <div className="home__progress-value">{wirdPercentage}%</div>
          <div className="home__progress-sub">الجزء {wirdPart}</div>
          <div className="home__progress-bar">
            <div
              className="home__progress-fill home__progress-fill--gold"
              style={{ width: `${wirdPercentage}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrayerProgress;
