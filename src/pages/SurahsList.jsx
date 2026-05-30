import { useSearchParams } from 'react-router-dom';
import SurahCard from './../components/quran/SurahCard';
import data from './../data/chapters.json';
import { useState, useEffect, useRef } from 'react';
const SurahsList = () => {
  const [params] = useSearchParams();
  const url = params.get('url');
  const reader = params.get('name');
  const surahsListParam = params.get('surahs_list');
  const surahsList = surahsListParam ? JSON.parse(decodeURIComponent(surahsListParam)) : null;
  const ITEMS_PER_PAGE = 4;
  console.log("Test page loaded with URL:", url, "and reader:", reader, "and surahs_list:", surahsList);
  
  const filteredChapters = surahsList ? data.chapters.filter(ch => surahsList.includes(String(ch.id)) || surahsList.includes(Number(ch.id)) || surahsList.includes(ch.id)).sort((a, b) => Number(a.id) - Number(b.id)) : data.chapters;
  
  // الحد الأقصى للسور المعروضة = حجم surahsList إذا كانت موجودة، وإلا كل السور
  const maxDisplayable = surahsList ? surahsList.length : filteredChapters.length;
  
  console.log("Filtered chapters:", filteredChapters);
  console.log("Surahs list:", surahsList);
  console.log("Max displayable:", maxDisplayable);
  console.log("Data chapters count:", data.chapters.length);
  
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [newIndices, setNewIndices] = useState(new Set(Array.from({ length: ITEMS_PER_PAGE }, (_, i) => i))); // ← animate الأولى كمان
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedCount < maxDisplayable) {
          setDisplayedCount(prev => {
            const newCount = Math.min(prev + ITEMS_PER_PAGE, maxDisplayable);
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
  }, [displayedCount, maxDisplayable]);
  // ← وقت الـ timeout يكون أكبر شوية من الـ animation (1.2s)
  useEffect(() => {
    if (newIndices.size > 0) {
      const timer = setTimeout(() => setNewIndices(new Set()), 1500);
      return () => clearTimeout(timer);
    }
  }, [newIndices]);

  const displayedSurahs = filteredChapters.slice(0, displayedCount);

  return (
    <div className="surah-grid-wrapper">
      <div className="surah-grid">
        {displayedSurahs.map((surah, index) => {
          const isNew = newIndices.has(index);
          const animationClass = isNew ? (index % 2 === 0 ? 'card-slide-in-right' : 'card-slide-in-left') : '';
          const formattedKey = String(surah.id).padStart(3, '0'); // ← 1 → "001"
          surah.id = formattedKey; // ← عشان الـ SurahCard يقدر يستخدمه زي ما هو متوقع
          return (
            <div key={formattedKey} className={animationClass}>
              <SurahCard audiUrl={url+"/"+formattedKey+".mp3"} surah={surah} reader={reader} surahsList={surahsList} />
            </div>
          );
        })}
      </div>
      {displayedCount < maxDisplayable && (
        <div ref={observerTarget} style={{ padding: '20px', textAlign: 'center' }}>
          <p>جاري تحميل المزيد...</p>
        </div>
      )}
    </div>
  );
};

export default SurahsList;