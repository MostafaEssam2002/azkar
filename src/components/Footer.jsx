import { BookOpen, CalendarDays, Radio, Sparkles } from 'lucide-react';
import BottomBar from './footer/BottomBar';
import BrandColumn from './footer/BrandColumn';
import PlatformColumn from './footer/PlatformColumn';
import QuoteColumn from './footer/QuoteColumn';

const stats = [
  { icon: BookOpen, value: '200+ قارئ', label: 'قرّاء' },
  { icon: Radio, value: '100+ بث', label: 'إذاعة' },
  { icon: BookOpen, value: '114 سورة', label: 'القرآن' },
  { icon: CalendarDays, value: 'تتبع يومي', label: 'القراءة' },
  { icon: Sparkles, value: 'آلاف الأذكار', label: 'الذِكر' },
];

const Footer = () => (
  <footer className="footer">
    <ul className="footer__features" aria-label="إحصائيات المنصة">
      {stats.map(({ icon: Icon, value, label }) => (
        <li className="footer__feature" key={label}>
          <span className="footer__feature-icon">
            <Icon size={18} />
          </span>
          <span className="footer__feature-text">
            <strong className="footer__feature-title">{value}</strong>
            <span className="footer__feature-subtitle">{label}</span>
          </span>
        </li>
      ))}
    </ul>
    <div className="footer__top">
      <div className="footer__grid">
        <BrandColumn />
        <PlatformColumn />
        <QuoteColumn />
      </div>
    </div>
    <BottomBar />
  </footer>
);

export default Footer;
