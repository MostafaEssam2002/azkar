const LogoMark = () => (
  <svg viewBox="0 0 100 100" className="footer__logo-icon" aria-hidden="true">
    <path
      d="M50 6 C28 6 12 24 12 46 L12 92 L88 92 L88 46 C88 24 72 6 50 6 Z"
      className="footer__logo-icon-bg"
    />
    <circle cx="50" cy="20" r="3.4" className="footer__logo-icon-moon" />
    <path
      d="M44 18 a7 7 0 1 0 9 9 a8 8 0 1 1 -9 -9 Z"
      className="footer__logo-icon-moon"
    />
    <path
      d="M50 40 C44 40 40 45 40 50 L40 64 L60 64 L60 50 C60 45 56 40 50 40 Z"
      className="footer__logo-icon-dome"
    />
    <rect x="26" y="56" width="6" height="20" className="footer__logo-icon-tower" />
    <rect x="68" y="56" width="6" height="20" className="footer__logo-icon-tower" />
    <rect x="34" y="64" width="32" height="12" className="footer__logo-icon-base" />
  </svg>
);

export default LogoMark;
