import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, ListOrdered } from 'lucide-react';
import '../../../src/styles/components/_surah-hero.scss';

const SurahHero = ({ chapter }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    setIsVisible(true);
  }, []);

  if (!chapter) return null;

  const revelationType = chapter.revelation_place === "makkah" ? "مكية" : "مدنية";
  const versesCount = chapter.verses_count;
  const revelationOrder = chapter.revelation_order;
  const surahName = chapter.name_arabic || "";

  return (
    <section className={`surah-hero ${isVisible ? 'surah-hero--visible' : ''}`}>
      {/* Decorative patterns background */}
      <div className="surah-hero__pattern surah-hero__pattern--left" />
      <div className="surah-hero__pattern surah-hero__pattern--right" />

      {/* Top decorative border */}
      <div className="surah-hero__top-border" />

      {/* Content wrapper */}
      <div className="surah-hero__content">
        {/* Basmala */}
        <div className="surah-hero__basmala">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        {/* Decorative divider under Basmala */}
        <div className="surah-hero__divider" />

        {/* Radial glow effect for title */}
        <div className="surah-hero__glow" />

        {/* Surah name (main title) */}
        <h1 className="surah-hero__title">{surahName}</h1>

        {/* Metadata cards */}
        <div className="surah-hero__metadata">
          {/* Revelation type card */}
          <div className="surah-hero__card surah-hero__card--animate-delay-1">
            <div className="surah-hero__card-icon">
              <BookOpen size={20} />
            </div>
            <span className="surah-hero__card-text">{revelationType}</span>
          </div>

          {/* Verses count card */}
          <div className="surah-hero__card surah-hero__card--animate-delay-2">
            <div className="surah-hero__card-icon">
              <Clock size={20} />
            </div>
            <span className="surah-hero__card-text">{versesCount} آية</span>
          </div>

          {/* Revelation order card */}
          <div className="surah-hero__card surah-hero__card--animate-delay-3">
            <div className="surah-hero__card-icon">
              <ListOrdered size={20} />
            </div>
            <span className="surah-hero__card-text">
              ترتيب النزول: {revelationOrder}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="surah-hero__bottom-border" />

      {/* Floating particles background */}
      <div className="surah-hero__particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="surah-hero__particle"
            style={{
              left: `${20 + i * 13}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default SurahHero;
