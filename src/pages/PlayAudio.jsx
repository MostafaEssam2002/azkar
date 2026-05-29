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
    const [readerName] = useState(reader);
    const currentSurah = Number(surahNumber);

    const relatedSurahs = useMemo(() =>
        data.chapters
            .filter((surah) => surah.id !== currentSurah)
            .sort(() => Math.random() - 0.5)
            .slice(0, 10),
        [currentSurah]
    );

    const handleShowMore = () => {
        const baseUrl = src.split('/').slice(0, -1).join('/');
        console.log(`Base URL = ${baseUrl}`);
        navigate(`/quran/test?url=${baseUrl}`);
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
            />
        </div>
    );
};

export default PlayAudio;