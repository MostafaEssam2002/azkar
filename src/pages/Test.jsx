import { useSearchParams } from 'react-router-dom';
import SurahCard from './../components/quran/SurahCard';
import data from './../data/chapters.json';
import { useState, useEffect, useRef } from 'react';
const Test = () => {
  const [params] = useSearchParams();
  const url = params.get('url');
  console.log('Received URL:', url);
  
  const ITEMS_PER_PAGE = 4;
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [newIndices, setNewIndices] = useState(new Set(Array.from({ length: ITEMS_PER_PAGE }, (_, i) => i))); // ← animate الأولى كمان
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedCount < data.chapters.length) {
          setDisplayedCount(prev => {
            const newCount = Math.min(prev + ITEMS_PER_PAGE, data.chapters.length);
            const newSet = new Set();
            for (let i = prev; i < newCount; i++) {
              newSet.add(i);
            }
            setNewIndices(newSet); // ← بس الجديدة فقط
            return newCount;
          });
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [displayedCount]);
  // ← وقت الـ timeout يكون أكبر شوية من الـ animation (1.2s)
  useEffect(() => {
    if (newIndices.size > 0) {
      const timer = setTimeout(() => setNewIndices(new Set()), 1500);
      return () => clearTimeout(timer);
    }
  }, [newIndices]);

  const displayedSurahs = data.chapters.slice(0, displayedCount);

  return (
    <div className="surah-grid-wrapper">
      <div className="surah-grid">
        {displayedSurahs.map((surah, index) => {
          const isNew = newIndices.has(index);
          const animationClass = isNew
            ? (index % 2 === 0 ? 'card-slide-in-right' : 'card-slide-in-left')
            : '';
          
          const formattedKey = String(surah.id).padStart(3, '0'); // ← 1 → "001"
          surah.id = formattedKey; // ← عشان الـ SurahCard يقدر يستخدمه زي ما هو متوقع
          return (
            <div key={formattedKey} className={animationClass}>
              <SurahCard audiUrl={url+"/"+formattedKey+".mp3"} surah={surah} />
              {/* {console.log(`surah.id= ${formattedKey}`)} */}
            </div>
          );
        })}
      </div>
      {displayedCount < data.chapters.length && (
        <div ref={observerTarget} style={{ padding: '20px', textAlign: 'center' }}>
          <p>جاري تحميل المزيد...</p>
        </div>
      )}
    </div>
  );
};

export default Test;