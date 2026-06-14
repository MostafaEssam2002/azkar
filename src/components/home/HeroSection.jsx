
import { IconBook, IconClock } from './../../icons/HomeIcons';

/**
 * @param {{ onQuranClick: Function, onAdhkarClick: Function }} props
 */
const HeroSection = ({ onQuranClick, onAdhkarClick }) => (
  <div className="home__hero">
    <div className="home__greeting">السلام عليكم</div>
    <div className="home__sub">صباح الخير</div>
    <div className="home__date">14 ذو القعدة 1447 هـ &nbsp;•&nbsp; 21 مايو 2025 م</div>
    <div className="home__hero-btns">
      <button className="home__btn home__btn--quran" onClick={onQuranClick}>
        <IconBook />
        اقرأ القرآن
      </button>
      <button className="home__btn home__btn--adhkar" onClick={onAdhkarClick}>
        <IconClock />
        أذكار اليوم
      </button>
    </div>
  </div>
);

export default HeroSection;
