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
    const surahsListParam = params.get('surahs_list');
    const surahsList = surahsListParam ? JSON.parse(decodeURIComponent(surahsListParam)) : null;
    const [readerName] = useState(reader);
    const currentSurah = Number(surahNumber);

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
    return (
        <div className="player-wrapper">
            <AudioPlayer
                src={src}
                arabicTitle={arabicTitle}
                surahNumber={surahNumber}
                surahName={surahName}
                reader={readerName}
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