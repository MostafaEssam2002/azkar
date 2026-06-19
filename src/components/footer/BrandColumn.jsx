import LogoMark from "./LogoMark";
import SectionDivider from "./SectionDivider";
import { socialLinks } from './../../utils/mappedIcons';

const BrandColumn = () => (
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
        <a key={label} href={href} className="footer__social-link" aria-label={label}>
          <Icon size={18} strokeWidth={1.8} />
        </a>
      ))}
    </div>
  </div>
);

export default BrandColumn;
