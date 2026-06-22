// hooks/useRadioPlayer.js
import { useState, useRef, useEffect, useCallback } from "react";
import radiosData from "../data/radios.json";

const PLAYING_RADIO_KEY = "playingRadioId";

const useRadioPlayer = () => {
  const [playingId, setPlayingId] = useState(() => {
    return localStorage.getItem(PLAYING_RADIO_KEY) || null;
  });
  const audioRef = useRef(null);

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingId(null);
    localStorage.removeItem(PLAYING_RADIO_KEY);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  useEffect(() => {
    if (!playingId) return;

    const selectedRadio = radiosData.radios.find((r) => r.id === playingId);
    if (!selectedRadio) {
      stopAudio();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const nextAudio = new Audio(selectedRadio.url);
    audioRef.current = nextAudio;
    nextAudio.play().catch(() => {});

    return () => {
      nextAudio.pause();
      if (audioRef.current === nextAudio) {
        audioRef.current = null;
      }
    };
  }, [playingId, stopAudio]);

  const togglePlay = useCallback((radio) => {
    if (playingId === radio.id) {
      stopAudio();
      return;
    }
    localStorage.setItem(PLAYING_RADIO_KEY, radio.id);
    setPlayingId(radio.id);
  }, [playingId, stopAudio]);

  const playingRadio = radiosData.radios.find((r) => r.id === playingId);

  return { playingId, playingRadio, togglePlay, stopAudio };
};

export default useRadioPlayer;