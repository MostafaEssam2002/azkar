import { useRef, useState, useEffect, useCallback } from "react";

const OrnamentalCorner = () => (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 28 Q4 4 28 4" stroke="#2d6a4f" strokeWidth="1.5" fill="none"/>
        <path d="M4 20 Q4 4 20 4" stroke="#2d6a4f" strokeWidth="1" fill="none"/>
        <circle cx="4" cy="4" r="2" fill="#2d6a4f"/>
        <path d="M10 4 L4 4 L4 10" stroke="#2d6a4f" strokeWidth="1.5" fill="none"/>
        <path d="M18 2 Q28 2 28 12" stroke="#2d6a4f" strokeWidth="0.8" fill="none" opacity="0.5"/>
    </svg>
);

const generateBars = (count = 90) =>
    Array.from({ length: count }, (_, i) =>
        8 + Math.abs(Math.sin(i * 0.35) * 28) + Math.random() * 14
    );

const BAR_HEIGHTS = generateBars();

const AudioPlayer = ({ src, arabicTitle, surahNumber, surahName, reader }) => {
    const audioRef = useRef(null);
    const [playing, setPlaying]       = useState(false);
    const [progress, setProgress]     = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration]     = useState("—");
    const [volume, setVolume]         = useState(0.75);

const fmt = (s) => {
    if (isNaN(s)) return "—";
    const hrs  = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    if (hrs > 0)
        return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
    else              { audio.pause(); setPlaying(false); }
};

    const seek = (e) => {
        const rect  = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const audio = audioRef.current;
        if (audio.duration) audio.currentTime = ratio * audio.duration;
    };

const skip = (sec) => {
    const audio = audioRef.current;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + sec));
};

const changeVolume = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    audioRef.current.volume = v;
}, []);

  const activeBarCount = Math.floor((progress / 100) * BAR_HEIGHTS.length);

return (
    <div className="player-wrapper">
        <div className="player-card">
        <audio ref={audioRef} src={src} preload="metadata" />

        {/* Ornamental corners */}
        <div className="corner tl"><OrnamentalCorner /></div>
        <div className="corner tr"><OrnamentalCorner /></div>
        <div className="corner bl"><OrnamentalCorner /></div>
        <div className="corner br"><OrnamentalCorner /></div>

        {/* Header */}
        <span className="badge">سورة {surahNumber}</span>
        <p className="arabic">{arabicTitle}</p>
        <p className="title">{surahName}</p>
        <p className="sub">القارئ: {reader}</p>

        {/* Player box */}
        <div className="player-box">

          {/* Waveform */}
            <div className="waveform">
            {BAR_HEIGHTS.map((h, i) => (
                <div
                key={i}
                className={`bar${i < activeBarCount ? " active" : ""}${playing && i >= activeBarCount ? " playing" : ""}`}
                style={{
                    height: `${h}px`,
                  animationDelay: playing ? `${(i % 8) * 0.1}s` : "0s",
                }}
            />
            ))}
        </div>

          {/* Times */}
        <div className="times">
            <span>{currentTime}</span>
            <span>{duration}</span>
        </div>

          {/* Progress */}
        <div className="progress-bg" onClick={seek}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

          {/* Controls */}
        <div className="controls">
            <button onClick={() => skip(-10)}>⏮ 10s</button>
            <button className="play-btn" onClick={togglePlay}>
            {playing ? "⏸" : "▶"}
            </button>
            <button onClick={() => skip(10)}>10s ⏭</button>
        </div>

          {/* Volume */}
        <div className="volume-wrapper">
            <button
            className="vol-btn"
            onClick={() => changeVolume({ target: { value: Math.max(0, +(volume - 0.1).toFixed(2)) } })}
            >−</button>
            <input
            type="range"
            min={0} max={1} step={0.05}
            value={volume}
            onChange={changeVolume}
              style={{ "--val": `${volume * 100}%` }}
            />
            <button
            className="vol-btn"
            onClick={() => changeVolume({ target: { value: Math.min(1, +(volume + 0.1).toFixed(2)) } })}
            >+</button>
        </div>

        </div>
    </div>
    </div>
);
};

export default AudioPlayer;