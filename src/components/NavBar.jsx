import { Link } from "react-router-dom";
import { useContext } from "react";
import { PrayerContext } from "./PrayerContext";
import { PRAYERS_AR, PRAYER_ICONS } from "../utils/constants";

const NavBar = () => {
  const prayerData = useContext(PrayerContext);
  
  if (!prayerData) {
    return (
      <nav className="navbar">
        <ul className="navbar__list">
          <li className="navbar__item">
            <Link to="/quran/read">القرآن</Link>
          </li>
          <li className="navbar__item">
            <Link to="/azkar">الأذكار</Link>
          </li>
          <li className="navbar__item">
            <Link to="/quran">تلاوة</Link>
          </li>
          <li className="navbar__item">
            <Link to="/quran/radio">الاذاعه</Link>
          </li>
          <li className="navbar__item">مواقيت الصلاة</li>
        </ul>
      </nav>
    );
  }

  const { nextPrayer, countdown } = prayerData;

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__item">
          <Link to="/quran/read">القرآن</Link>
        </li>
        <li className="navbar__item">
          <Link to="/azkar">الأذكار</Link>
        </li>
        <li className="navbar__item">
          <Link to="/quran">تلاوة</Link>
        </li>
        <li className="navbar__item">
          <Link to="/quran/radio">الاذاعه</Link>
        </li>
        <li className="navbar__item">
          <Link to="/prayer_times">مواقيت الصلاة</Link>
        </li>

        {/* Countdown Display */}
        {nextPrayer && (
          <li className="navbar__countdown">
            <div className="navbar__countdown-content">
              <span className="navbar__countdown-icon">
                {PRAYER_ICONS?.[nextPrayer.key] || '🕌'}
              </span>
              <span className="navbar__countdown-label">
                {PRAYERS_AR?.[nextPrayer.key] || 'مواقيت الصلاة'}
              </span>
              <span className="navbar__countdown-timer">{countdown}</span>
            </div>
          </li>
        )}

        {!nextPrayer && (
          <li className="navbar__item">مواقيت الصلاة</li>
        )}
      </ul>
    </nav>
  )
}

export default NavBar