import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const AudioPlayer = ({ src, arabicTitle , surahNumber , surahName , reader}) => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("—");
    const [volume, setVolume] = useState(1);
    const fmt = (s) => {
    if (isNaN(s)) return "—";
        const hrs  = Math.floor(s / 3600);
        const mins = Math.floor((s % 3600) / 60);
        const secs = Math.floor(s % 60);
        if (hrs > 0) {
            // 1:05:09
            return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
        // 5:09
        return `${mins}:${String(secs).padStart(2, "0")}`;
    };
    useEffect(() => {
        const audio = audioRef.current;
        const onMeta = () => setDuration(fmt(audio.duration));
        const onTime = () => {
        setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        setCurrentTime(fmt(audio.currentTime));
        };
        const onEnd = () => setPlaying(false);
        audio.addEventListener("loadedmetadata", onMeta);
        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("ended", onEnd);
        return () => {
        audio.removeEventListener("loadedmetadata", onMeta);
        audio.removeEventListener("timeupdate", onTime);
        audio.removeEventListener("ended", onEnd);
        };
    }, []);
    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio.paused) { audio.play(); setPlaying(true); }
        else { audio.pause(); setPlaying(false); }
    };
    const seek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const audio = audioRef.current;
        if (audio.duration) audio.currentTime = ratio * audio.duration;
    };
    const skip = (sec) => {
        const audio = audioRef.current;
        audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + sec));
    };
    const changeVolume = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        audioRef.current.volume = v;
    };
    return (
        <div className="player-card">
        <audio ref={audioRef} src={src} preload="metadata" />
        <span className="badge">سورة {surahNumber}</span>
        <p className="title">{surahName}</p>
        <p className="sub">القارئ: {reader}</p>
        <p className="arabic">{arabicTitle}</p>
        <div className="progress-bg" onClick={seek}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="times">
            <span>{currentTime}</span>
            <span>{duration}</span>
        </div>
        <div className="controls">
            <button onClick={() => skip(-10)}>⏮ 10s</button>
            <button className="play-btn" onClick={togglePlay}>
            {playing ? "⏸" : "▶"}
            </button>
            <button onClick={() => skip(10)}>10s ⏭</button>
        </div>
        <div className="volume-wrapper">
            <button className="vol-btn" onClick={() => changeVolume({ target: { value: Math.max(0, volume - 0.1) } })}>−</button>
            <input type="range" min={0} max={1} step={0.05} value={volume} onChange={changeVolume} style={{ '--val': `${volume * 100}%` }} />
            <button className="vol-btn" onClick={() => changeVolume({ target: { value: Math.min(1, volume + 0.1) } })}>+</button>
        </div>
        {/* <input type="range" min={0} max={1} step={0.05} value={volume} onChange={changeVolume} /> */}
        </div>
    );
};

export default AudioPlayer