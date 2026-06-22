import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { PrayerContext } from "./prayer/PrayerContext";
import { PRAYERS_AR, PRAYER_ICONS } from "../utils/constants";
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const navigate = useNavigate();
  const prayerData = useContext(PrayerContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null);

  // Close menu on outside click / touch
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const renderLink = (to, label, end = true) => (
    <li className="navbar__item">
      <NavLink
        to={to}
        end={end}
        onClick={closeMenu}
        className={({ isActive }) =>
          isActive ? "navbar__link navbar__link--active" : "navbar__link"
        }
      >
        {label}
      </NavLink>
    </li>
  );

  const countdownBlock = prayerData?.nextPrayer ? (
    <li className="navbar__countdown">
      <div className="navbar__countdown-content">
        <span className="navbar__countdown-icon">
          {PRAYER_ICONS?.[prayerData.nextPrayer.key] || "🕌"}
        </span>
        <span className="navbar__countdown-label">
          {PRAYERS_AR?.[prayerData.nextPrayer.key] || "مواقيت الصلاة"}
        </span>
        <span className="navbar__countdown-timer">{prayerData.countdown}</span>
        <button
          className={`navbar__sound-btn ${prayerData.isAudioMuted ? "muted" : "active"
            }`}
          onClick={prayerData.toggleMute}
          title={
            prayerData.isAudioMuted
              ? "تم كتم الصوت - اضغط لتشغيله"
              : "التنبيه الصوتي مفعل"
          }
        >
          {prayerData.isAudioMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </li>
  ) : (
    <li className="navbar__item">مواقيت الصلاة</li>
  );

  return (
    <nav
      className="navbar"
      ref={navRef}
    >
      {/* ── Logo/Branding ───────────────────────────── */}
      <div className="navbar__logo" onClick={() => navigate('/')}>
        <img
          src="/logo.png"
          alt="ذَكِّرْ"
          className="navbar__logo-image"
        />
      </div>

      {/* ── Hamburger button (mobile only) ─────────── */}
      <button
        className={`navbar__hamburger${menuOpen ? " navbar__hamburger--open" : ""}`}
        aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="navbar__hamburger-bar" />
        <span className="navbar__hamburger-bar" />
        <span className="navbar__hamburger-bar" />
      </button>

      {/* ── Nav links ──────────────────────────────── */}
      <ul className={`navbar__list${menuOpen ? " navbar__list--open" : ""}`}>
        {renderLink("/quran", "القرآن", true)}
        {renderLink("/azkar", "الأذكار", false)}
        {renderLink("/tilawa", "تلاوة", true)}
        {renderLink("/radio", "الاذاعه", true)}
        {renderLink("/wird", "الورد اليومي", true)}
        {renderLink("/prayer_times", "مواقيت الصلاة", true)}
        {countdownBlock}
      </ul>
    </nav>
  );
};

export default NavBar;
