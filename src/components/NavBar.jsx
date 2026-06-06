import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { PrayerContext } from "./PrayerContext";
import { PRAYERS_AR, PRAYER_ICONS } from "../utils/constants";

const NavBar = () => {
  const prayerData = useContext(PrayerContext);

  const renderLink = (to, label, end = true) => (
    <li className="navbar__item">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          isActive ? "navbar__link navbar__link--active" : "navbar__link"
        }
      >
        {label}
      </NavLink>
    </li>
  );
  
  if (!prayerData) {
    return (
      <nav className="navbar">
        <ul className="navbar__list">
          {renderLink("/quran", "القرآن", true)}
          {renderLink("/azkar", "الأذكار", false)}
          {renderLink("/tilawa", "تلاوة", true)}
          {renderLink("/radio", "الاذاعه", true)}
          {renderLink("/wird", "الورد اليومي", true)}
          <li className="navbar__item">مواقيت الصلاة</li>
        </ul>
      </nav>
    );
  }

  const { nextPrayer, countdown } = prayerData;

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        {renderLink("/quran", "القرآن", true)}
        {renderLink("/azkar", "الأذكار", false)}
        {renderLink("/tilawa", "تلاوة", true)}
        {renderLink("/radio", "الاذاعه", true)}
        {renderLink("/wird", "الورد اليومي", true)}

        {renderLink("/prayer_times", "مواقيت الصلاة", true)}

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