import { useSearchParams } from 'react-router-dom';
import AudioPlayer from './../components/quran/AudioPlayer';
const PlayAudio = () => {
    const [params] = useSearchParams();
    let src = params.get('src');
    let arabicTitle = params.get('arabicTitle');
    let surahNumber = parseInt(params.get('surahNumber'));
    let surahName = params.get('surahName');
    let reader = params.get('reader');
    return (
        <div>
            <AudioPlayer src={src} arabicTitle={arabicTitle} surahNumber={surahNumber} surahName={surahName} reader={reader}/>
        </div>
    )
}
export default PlayAudio