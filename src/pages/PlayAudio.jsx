import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import AudioPlayer from './../components/quran/AudioPlayer';
import SurahCarousel from './../components/quran/SurahCarousel';
import data from './../data/chapters.json';

const PlayAudio = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const src         = params.get('src');
    const arabicTitle = params.get('arabicTitle');
    const surahNumber = parseInt(params.get('surahNumber'));
    const surahName   = params.get('surahName');
    const reader      = params.get('reader');
    const autoPlay    = params.get('autoplay') === '1';
    const surahsListParam = params.get('surahs_list');
    const surahsList = surahsListParam ? JSON.parse(decodeURIComponent(surahsListParam)) : null;
    const [readerName] = useState(reader);
    const currentSurah = Number(surahNumber);

    const nextSurah = useMemo(() => {
        if (!Array.isArray(surahsList) || surahsList.length === 0) return null;
        const ids = surahsList.map((id) => Number(id));
        const currentIndex = ids.indexOf(currentSurah);
        if (currentIndex === -1) return null;

        const nextId = ids[(currentIndex + 1) % ids.length];
        return data.chapters.find((chapter) => Number(chapter.id) === nextId) || null;
    }, [surahsList, currentSurah]);

    const relatedSurahs = useMemo(() => {
        const chaptersToUse = surahsList 
            ? data.chapters.filter(ch => surahsList.includes(String(ch.id)) || surahsList.includes(Number(ch.id)) || surahsList.includes(ch.id))
            : data.chapters;
        
        return chaptersToUse
            .filter((surah) => surah.id !== currentSurah)
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    }, [currentSurah, surahsList]);

    const handleShowMore = () => {
        const baseUrl = src.split('/').slice(0, -1).join('/');
        const queryParams = `url=${encodeURIComponent(baseUrl)}&name=${encodeURIComponent(reader)}`;
        const finalUrl = surahsList ? `${queryParams}&surahs_list=${encodeURIComponent(JSON.stringify(surahsList))}` : queryParams;
        navigate(`/tilawa/surahsList?${finalUrl}`);
    };

    const handleAutoNext = () => {
        if (!nextSurah) return;
        const baseUrl = src.split('/').slice(0, -1).join('/');
        const nextSrc = `${baseUrl}/${String(nextSurah.id).padStart(3, '0')}.mp3`;
        const nextQuery = new URLSearchParams({
            src: nextSrc,
            arabicTitle: nextSurah.name_arabic,
            surahNumber: String(nextSurah.id),
            surahName: nextSurah.name_complex,
            reader: readerName,
            autoplay: '1',
        });

        if (Array.isArray(surahsList) && surahsList.length > 0) {
            nextQuery.set('surahs_list', JSON.stringify(surahsList));
        }

        navigate(`/tilawa/surahsList/play?${nextQuery.toString()}`);
    };

    return (
        <div className="player-wrapper">
            <AudioPlayer
                src={src}
                arabicTitle={arabicTitle}
                surahNumber={surahNumber}
                surahName={surahName}
                reader={readerName}
                onAutoNext={handleAutoNext}
                autoPlay={autoPlay}
            />
            <SurahCarousel
                surahs={relatedSurahs}
                currentSrc={src}
                reader={readerName}
                onShowMore={handleShowMore}
                surahsList={surahsList}
            />
        </div>
    );
};

export default PlayAudio;