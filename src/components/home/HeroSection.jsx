import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { IconBook, IconClock } from './../../icons/HomeIcons';
import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * @param {{ onQuranClick: Function, onAdhkarClick: Function }} props
 */
const HeroSection = ({ onQuranClick, onAdhkarClick }) => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      direction: 'rtl',
    },
    [autoplayPlugin.current]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    autoplayPlugin.current.play();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    autoplayPlugin.current.play();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (idx) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(idx);
      autoplayPlugin.current.play();
    },
    [emblaApi]
  );

  const slides = [
    { id: 1, image: '/slider/azkar.png' },
    { id: 2, image: '/slider/prayer_times.png' },
    { id: 3, image: '/slider/quran.png' },
    { id: 4, image: '/slider/radio.png' },
    { id: 5, image: '/slider/tilawa.png' },
    { id: 6, image: '/slider/wird.png' },
  ];

  return (
    <div className="home__hero-wrapper">
      <div className="home__hero-slider" ref={emblaRef}>
        <div className="home__hero-container">
          {slides.map((slide) => (
            <div key={slide.id} className="home__hero-slide">
              <img
                src={slide.image}
                alt={`Hero slide ${slide.id}`}
                className="home__hero-image"
                draggable={false}
                loading="eager"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1366px) 100vw, 100vw"
              />
              <div className="home__hero-overlay" />
              {/* <div className="home__hero-content">
                <div className="home__greeting">السلام عليكم</div>
                <div className="home__sub">صباح الخير</div>
                <div className="home__date">
                  14 ذو القعدة 1447 هـ &nbsp;•&nbsp; 21 مايو 2025 م
                </div>
                <div className="home__hero-btns">
                  <button
                    className="home__btn home__btn--quran"
                    onClick={onQuranClick}
                  >
                    <IconBook />
                    اقرأ القرآن
                  </button>
                  <button
                    className="home__btn home__btn--adhkar"
                    onClick={onAdhkarClick}
                  >
                    <IconClock />
                    أذكار اليوم
                  </button>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      <button
        className="home__hero-nav home__hero-nav--prev"
        onClick={scrollPrev}
        aria-label="الشريحة السابقة"
      >
        ‹
      </button>
      <button
        className="home__hero-nav home__hero-nav--next"
        onClick={scrollNext}
        aria-label="الشريحة التالية"
      >
        ›
      </button>

      <div className="home__hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`home__hero-dot ${
              activeIndex === idx ? 'home__hero-dot--active' : ''
            }`}
            onClick={() => scrollTo(idx)}
            aria-label={`انتقل إلى الشريحة ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;