import { useState, useRef, useEffect, useCallback } from "react";
import radiosData from "../data/radios.json";

import NowPlayingBar from './../components/quran/NowPlayingBar';
import SearchBar from './../components/quran/SearchBar';
import RadioCard from './../components/quran/RadioCard';

const PER_PAGE = 12;
const PLAYING_RADIO_KEY = "playingRadioId";

const RadioApp = () => {
  const [playingId, setPlayingId] = useState(() => {
    return localStorage.getItem(PLAYING_RADIO_KEY) || null;
  });
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const audioRef = useRef(null);

  const filtered = radiosData.radios.filter((r) => r.name.includes(search));
  const shown    = filtered.slice(0, page * PER_PAGE);

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

  const togglePlay = (radio) => {
    if (playingId === radio.id) {
      stopAudio();
      return;
    }

    localStorage.setItem(PLAYING_RADIO_KEY, radio.id);
    setPlayingId(radio.id);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const playingRadio = radiosData.radios.find((r) => r.id === playingId);

  return (
    <div className="radio-app">

      {/* Banner */}
      <div className="radio-app__banner-wrap">
        <img
          src="/akram_alalaqmi1.jpg"
          alt="إذاعات القرآن الكريم"
          className="radio-app__banner-img"
        />
      </div>

      {/* Inner content */}
      <div className="radio-app__inner">

        {/* Now Playing */}
        {playingRadio && (
          <NowPlayingBar radio={playingRadio} onStop={stopAudio} />
        )}

        {/* Search */}
        <SearchBar value={search} onChange={handleSearchChange} />

        {/* Grid */}
        <div className="radio-app__grid">
          {shown.map((radio) => (
            <RadioCard
              key={radio.id}
              radio={radio}
              isPlaying={playingId === radio.id}
              onTogglePlay={togglePlay}
            />
          ))}
        </div>

        {/* Load More */}
        {shown.length < filtered.length && (
          <div className="radio-app__load-more-wrap">
            <button
              className="radio-app__load-more-btn"
              onClick={() => setPage((p) => p + 1)}
            >
              عرض المزيد ↓
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RadioApp;
