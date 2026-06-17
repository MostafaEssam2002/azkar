import  { useEffect, useState } from 'react';
import { BookOpen, Clock, ListOrdered } from 'lucide-react';
import '../../../src/styles/components/_surah-hero.scss';
import ReciterSelector from './ReciterSelector';

const SurahHero = ({ chapter, reciters, selectedReciter, onReciterChange, recitersLoading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!chapter) return null;

  const revelationType = chapter.revelation_place === "makkah" ? "مكية" : "مدنية";
  const versesCount = chapter.verses_count;
  const revelationOrder = chapter.revelation_order;
  const surahName = chapter.name_arabic || "";

  return (
    <section className={`surah-hero ${isVisible ? 'surah-hero--visible' : ''}`}>
      <div className="surah-hero__pattern surah-hero__pattern--left" />
      <div className="surah-hero__pattern surah-hero__pattern--right" />
      <div className="surah-hero__top-border" />

      <div className="surah-hero__content">
        <div className="surah-hero__basmala">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <div className="surah-hero__divider" />
        <div className="surah-hero__glow" />
        <h1 className="surah-hero__title">{surahName}</h1>

        <div className="surah-hero__metadata">
          <div className="surah-hero__card surah-hero__card--animate-delay-1">
            <div className="surah-hero__card-icon">
              <BookOpen size={20} />
            </div>
            <span className="surah-hero__card-text">{revelationType}</span>
          </div>

          <div className="surah-hero__card surah-hero__card--animate-delay-2">
            <div className="surah-hero__card-icon">
              <Clock size={20} />
            </div>
            <span className="surah-hero__card-text">{versesCount} آية</span>
          </div>

          <div className="surah-hero__card surah-hero__card--animate-delay-3">
            <div className="surah-hero__card-icon">
              <ListOrdered size={20} />
            </div>
            <span className="surah-hero__card-text">
              ترتيب النزول: {revelationOrder}
            </span>
          </div>

          <ReciterSelector
              reciters={reciters}
              selectedReciter={selectedReciter}
              onChange={onReciterChange}
              loading={recitersLoading}
          />
        </div>
      </div>

      <div className="surah-hero__bottom-border" />

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