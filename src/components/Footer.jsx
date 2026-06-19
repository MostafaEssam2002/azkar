import {
  BookOpen,
  Headphones,
  Radio,
  Clock,
  Bookmark,
  Sparkles,
  Star,
  Lock,
  Users,
  Heart,
} from "lucide-react";

// lucide-react no longer ships brand/logo icons (trademark reasons),
// so the social icons below are plain inline SVGs.
const FacebookIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.91c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
  </svg>
);

const TelegramIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M21.05 3.66 2.9 10.7c-1.23.49-1.22 1.17-.22 1.49l4.66 1.46 1.8 5.62c.22.6.38.84.78.84.34 0 .5-.16.7-.36l1.96-1.9 4.5 3.32c.84.46 1.43.22 1.64-.78l2.97-14c.3-1.27-.46-1.85-1.58-1.53Zm-3.36 3.6L9.3 13.6l-.36 3.7-1.6-5.04 9.74-5.86c.46-.27.88-.13.54.17Z" />
  </svg>
);

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M12 2.16c2.64 0 2.96.01 4 .06 1.05.05 1.79.22 2.43.47.66.26 1.14.6 1.65 1.1.5.5.84.99 1.1 1.65.25.64.42 1.38.47 2.43.05 1.04.06 1.36.06 4s-.01 2.96-.06 4c-.05 1.05-.22 1.79-.47 2.43a4.6 4.6 0 0 1-1.1 1.65c-.5.5-.99.84-1.65 1.1-.64.25-1.38.42-2.43.47-1.04.05-1.36.06-4 .06s-2.96-.01-4-.06c-1.05-.05-1.79-.22-2.43-.47a4.6 4.6 0 0 1-1.65-1.1 4.6 4.6 0 0 1-1.1-1.65c-.25-.64-.42-1.38-.47-2.43-.05-1.04-.06-1.36-.06-4s.01-2.96.06-4c.05-1.05.22-1.79.47-2.43.26-.66.6-1.15 1.1-1.65.5-.5.99-.84 1.65-1.1.64-.25 1.38-.42 2.43-.47 1.04-.05 1.36-.06 4-.06Zm0 4.38a5.46 5.46 0 1 0 0 10.92 5.46 5.46 0 0 0 0-10.92Zm0 9a3.54 3.54 0 1 1 0-7.08 3.54 3.54 0 0 1 0 7.08Zm6.96-9.21a1.28 1.28 0 1 1-2.56 0 1.28 1.28 0 0 1 2.56 0Z" />
  </svg>
);

const YoutubeIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M23.5 6.6a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.5A3 3 0 0 0 .5 6.6 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.4 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.4ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const XIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M18.24 2H21l-6.1 7 6.98 9.0h-5.46l-4.27-5.58L7.1 18h-2.77l6.53-7.49L4 2h5.6l3.87 5.1L18.24 2Zm-1.92 14.7h1.5L8.74 3.2H7.13l9.19 13.5Z" />
  </svg>
);

const platformLinks = [
  { icon: Sparkles, label: "الأذكار", href: "/azkar" },
  { icon: BookOpen, label: "القرآن الكريم", href: "/quran" },
  { icon: Headphones, label: "التلاوة", href: "/tilawa" },
  { icon: Radio, label: "الإذاعة الإسلامية", href: "/radio" },
  { icon: Clock, label: "مواقيت الصلاة", href: "/prayer_times" },
  { icon: Bookmark, label: "الورد القرآني", href: "/wird" },
];

const socialLinks = [
  { icon: FacebookIcon, href: "#", label: "فيسبوك" },
  { icon: TelegramIcon, href: "#", label: "تيليجرام" },
  { icon: InstagramIcon, href: "#", label: "انستجرام" },
  { icon: YoutubeIcon, href: "#", label: "يوتيوب" },
  { icon: XIcon, href: "#", label: "إكس" },
];

const features = [
  { icon: Clock, title: "متاح دائماً", subtitle: "على مدار الساعة" },
  { icon: Star, title: "جودة عالية", subtitle: "محتوى موثوق من مصادر معتمدة" },
  { icon: Lock, title: "موثوق وآمن", subtitle: "بياناتك محمية بالكامل" },
  { icon: Users, title: "مجتمع مسلم", subtitle: "نحو حياة إيمانية أفضل" },
];

const SectionDivider = () => (
  <div className="footer__divider" aria-hidden="true">
    <span className="footer__divider-line" />
    <span className="footer__divider-dot" />
    <span className="footer__divider-line" />
  </div>
);

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

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__grid">
          {/* Brand column */}
          <div className="footer__column footer__column--brand">
            <div className="footer__logo">
              <LogoMark />
              <div className="footer__logo-text">
                <span className="footer__logo-title">أذكار</span>
                <span className="footer__logo-tagline">منصة إسلامية متكاملة</span>
              </div>
            </div>

            <p className="footer__description">
              رفيقك اليومي للأذكار والقرآن الكريم ومواقيت الصلاة والتلاوات
              والإذاعات الإسلامية والورد القرآني، في مكان واحد.
            </p>

            <SectionDivider />

            <div className="footer__social">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="footer__social-link"
                  aria-label={label}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform sections column */}
          <div className="footer__column footer__column--platform">
            <h3 className="footer__heading">أقسام المنصة</h3>
            <SectionDivider />
            <ul className="footer__nav footer__nav--grid">
              {platformLinks.map(({ icon: Icon, label, href }) => (
                <li key={label} className="footer__nav-item">
                  <a href={href} className="footer__nav-link">
                    <span className="footer__nav-icon">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote column */}
          <div className="footer__column footer__column--quote">
            <h3 className="footer__heading">كلمة طيبة</h3>
            <SectionDivider />
            <div className="footer__quote-box">
              <span className="footer__quote-corner footer__quote-corner--tr" />
              <span className="footer__quote-corner footer__quote-corner--bl" />
              <p className="footer__quote-text">
                {"{"} وَاذْكُرْ رَبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً
                وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ بِالْغُدُوِّ وَالْآصَالِ
                وَلَا تَكُن مِّنَ الْغَافِلِينَ {"}"}
              </p>
              <span className="footer__quote-source">سورة الأعراف: 205</span>
            </div>
          </div>
        </div>

         
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-pattern" aria-hidden="true" />
        <div className="footer__bottom-content">
          <div className="footer__bottom-divider" aria-hidden="true">
            <span className="footer__bottom-divider-line" />
            <span className="footer__bottom-divider-moon">☽</span>
            <span className="footer__bottom-divider-line" />
          </div>
          <div className="footer__bottom-row">
            <p className="footer__copyright">أذكار - جميع الحقوق محفوظة © 2025</p>
            <p className="footer__made-with">
              صنع بكل حب للمسلمين <Heart size={14} fill="currentColor" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default Footer