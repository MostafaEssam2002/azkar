import { NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { PrayerContext } from "./PrayerContext";
import { PRAYERS_AR, PRAYER_ICONS } from "../utils/constants";
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const navigate = useNavigate();
  const prayerData = useContext(PrayerContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Navbar visibility state ──────────────────────────────────
  // Hidden when scroll position is at the very top (scrollY === 0)
  // Visible as soon as the user scrolls down (scrollY > 0)
  const [isNavbarVisible, setIsNavbarVisible] = useState(() => window.scrollY > 0);

  // Track whether the navbar has an enhanced scrolled look (deeper glass)
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 10);

  const navRef = useRef(null);

  // ── Performant scroll handler ────────────────────────────────
  // Uses requestAnimationFrame to batch DOM reads and avoid layout thrashing.
  // A ref tracks the rAF ID to prevent stacking multiple frames.
  useEffect(() => {
    let rafId = null;
    // Cache previous values to avoid unnecessary state updates (re-renders)
    let prevVisible = window.scrollY > 0;
    let prevScrolled = window.scrollY > 10;

    const handleScroll = () => {
      // Cancel any pending rAF to prevent stacking
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const nowVisible = scrollY > 0;
        const nowScrolled = scrollY > 10;

        // Only update state when the value actually changes
        if (nowVisible !== prevVisible) {
          prevVisible = nowVisible;
          setIsNavbarVisible(nowVisible);
        }
        if (nowScrolled !== prevScrolled) {
          prevScrolled = nowScrolled;
          setIsScrolled(nowScrolled);
        }
      });
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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

  // Build className string for the navbar
  // navbar--hidden: fully hidden (at scroll top)
  // navbar--visible: revealed (user has scrolled)
  // navbar--scrolled: enhanced glass effect for deeper scroll
  const navbarClass = [
    "navbar",
    isNavbarVisible ? "navbar--visible" : "navbar--hidden",
    isScrolled ? "navbar--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      className={navbarClass}
      ref={navRef}
      aria-hidden={!isNavbarVisible}
    >
      {/* ── Logo/Branding (Premium Islamic Icon) ──── */}
      <div className="navbar__logo" onClick={() => navigate('/')}>
        <span className="navbar__logo-icon">✨</span>
        <span className="navbar__logo-text">ذَكِّرْ</span>
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
