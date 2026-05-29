import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState, useRef } from 'react';
import SurahCard from './SurahCard';
const SurahCarousel = ({ surahs = [], currentSrc, reader, onShowMore }) => {
    const autoplayRef = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { direction: 'rtl', align: 'start', loop: true },
        [autoplayRef.current]
    );
    const [prevDisabled, setPrevDisabled] = useState(false);
    const [nextDisabled, setNextDisabled] = useState(false);
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevDisabled(!emblaApi.canScrollPrev());
        setNextDisabled(!emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="related-surahs">
            {/* ── Section Header ── */}
            <div className="related-surahs__header">
                <span className="related-surahs__line" />
                <h2 className="related-surahs__title">سور أخرى لنفس القارئ</h2>
                <span className="related-surahs__line" />
            </div>
            {/* ── Carousel ── */}
            <div className="related-surahs__slider-outer">
                <button
                    className="related-surahs__arrow"
                    onClick={scrollPrev}
                    disabled={prevDisabled}
                    aria-label="السابق"
                >
                    ‹
                </button>
                <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                        {surahs.map((surah) => {
                            const audioUrl = currentSrc.replace(
                                /(\d{3})\.mp3$/,
                                `${surah.id.toString().padStart(3, '0')}.mp3`
                            );
                            return (
                                <div className="embla__slide" key={surah.id}>
                                    <SurahCard
                                        surah={surah}
                                        audiUrl={audioUrl}
                                        reader={reader}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    className="related-surahs__arrow"
                    onClick={scrollNext}
                    disabled={nextDisabled}
                    aria-label="التالي"
                >
                    ›
                </button>
            </div>

            {/* ── More Button ── */}
            <div className="related-surahs__more">
                <button onClick={onShowMore}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M4 6h16M4 10h16M4 14h10" />
                    </svg>
                    عرض المزيد من السور
                </button>
            </div>
        </div>
    );
};

export default SurahCarousel;