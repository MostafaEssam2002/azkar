import { useState, useRef, useEffect, useCallback } from "react";

const useAudioPlayer = (src, onClose) => {
    const audioRef     = useRef(null);
    const [playing,     setPlaying]  = useState(false);
    const [progress,    setProgress] = useState(0);
    const [currentTime, setCurrent]  = useState("0:00");
    const [duration,    setDuration] = useState("—");
    const [volume,      setVolume]   = useState(0.85);

    const fmt = (s) => {
        if (!s || isNaN(s)) return "—";
        const m   = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, "0")}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onMeta = () => setDuration(fmt(audio.duration));
        const onTime = () => {
            setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
            setCurrent(fmt(audio.currentTime));
        };
        const onEnd = () => {
            setPlaying(false);
            setTimeout(() => onClose(), 1000);
        };

        audio.addEventListener("loadedmetadata", onMeta);
        audio.addEventListener("timeupdate",     onTime);
        audio.addEventListener("ended",          onEnd);
        audio.play().then(() => setPlaying(true)).catch(() => {});

        return () => {
            audio.removeEventListener("loadedmetadata", onMeta);
            audio.removeEventListener("timeupdate",     onTime);
            audio.removeEventListener("ended",          onEnd);
            audio.pause();
        };
    }, [src, onClose]);

    const toggle = () => {
        const a = audioRef.current;
        if (a.paused) { a.play(); setPlaying(true); }
        else          { a.pause(); setPlaying(false); }
    };

    const skip = (sec) => {
        const a = audioRef.current;
        a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + sec));
    };

    const seek = (e) => {
        const rect  = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const a     = audioRef.current;
        if (a.duration) a.currentTime = ratio * a.duration;
    };

    const changeVolume = useCallback((val) => {
        const v = Math.max(0, Math.min(1, val));
        setVolume(v);
        if (audioRef.current) audioRef.current.volume = v;
    }, []);

    return { audioRef, playing, progress, currentTime, duration, volume, toggle, skip, seek, changeVolume };
};

export default useAudioPlayer;
