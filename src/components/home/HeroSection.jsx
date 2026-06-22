import { BookOpen, Clock3, Headphones, Sparkles } from 'lucide-react';
import useHeroCarousel from '../../hooks/useHeroCarousel';

const slides = [
  { id: 1, image: '/slider/azkar.png' },
  { id: 2, image: '/slider/prayer_times.png' },
  { id: 3, image: '/slider/quran.png' },
  { id: 4, image: '/slider/radio.png' },
  { id: 5, image: '/slider/tilawa.png' },
  { id: 6, image: '/slider/wird.png' },
  { id: 7, image: '/slider/masjed.jpg' },
];

const heroHighlights = [
  { icon: BookOpen, label: 'اقرأ' },
  { icon: Headphones, label: 'استمع' },
  { icon: Sparkles, label: 'تعلم' },
];

/**
 * @param {{ onQuranClick: Function, onAdhkarClick: Function }} props
 */
const HeroSection = ({ onQuranClick, onAdhkarClick }) => {
  const { emblaRef, activeIndex, scrollPrev, scrollNext, scrollTo } = useHeroCarousel();

  return (
    <div className="home__hero-wrapper">
      <div className="home__hero-slider" ref={emblaRef}>
        <div className="home__hero-container">
          {slides.map((slide) => (
            <div key={slide.id} className="home__hero-slide">
              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                className="home__hero-image"
                draggable={false}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, (max-width: 1366px) 100vw, 100vw"
              />
              <div className="home__hero-overlay" />
              {slide.id !== 3 && slide.id !== 1 && (
                <div className="home__hero-content">
                  <span className="home__hero-badge">منصة ذَكِّرْ</span>
                  <div className="home__hero-support">
                    {heroHighlights.map(({ icon: Icon, label }) => (
                      <span key={label} className="home__hero-support__item">
                        <Icon size={14} />
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="home__hero-btns">
                    <button
                      className="home__btn home__btn--primary"
                      onClick={onQuranClick}
                      type="button"
                    >
                      <BookOpen size={18} />
                      ابدا القراءة
                    </button>
                    <button
                      className="home__btn home__btn--secondary"
                      onClick={onAdhkarClick}
                      type="button"
                    >
                      <Clock3 size={18} />
                      أذكار اليوم
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        className="home__hero-nav home__hero-nav--prev"
        onClick={scrollNext}
        type="button"
        aria-label="الشريحة السابقة"
      >
        ›
      </button>
      <button
        className="home__hero-nav home__hero-nav--next"
        onClick={scrollPrev}
        type="button"
        aria-label="الشريحة التالية"
      >
        ‹
      </button>

      <div className="home__hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`home__hero-dot ${activeIndex === idx ? 'home__hero-dot--active' : ''}`}
            onClick={() => scrollTo(idx)}
            type="button"
            aria-label={`انتقل إلى الشريحة ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;