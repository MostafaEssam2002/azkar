// import { useState, useRef } from "react";
// import radiosData from "../data/radios.json";

// const getInitials = (name) => {
//   const clean = name.replace(/إذاعة|اذاعة|-/g, "").trim();
//   const words = clean.split(" ").filter(Boolean);
//   if (words.length >= 2) return words[0][0] + words[1][0];
//   return clean.slice(0, 2);
// };

// // ── Wave Bars ──────────────────────────────────────────────────────────────
// const WaveBars = ({ count = 4, active }) => {
//   const baseHeights = [8, 14, 10, 18, 12, 16, 9];
//   return (
//     <div className="wave-bars">
//       {Array.from({ length: count }, (_, i) => (
//         <div
//           key={i}
//           className={`wave-bars__bar${active ? " wave-bars__bar--active" : ""}`}
//           style={{ height: baseHeights[i % baseHeights.length] }}
//         />
//       ))}
//     </div>
//   );
// };

// // ── Avatar ─────────────────────────────────────────────────────────────────
// const Avatar = ({ radio, isPlaying }) => {
//   const [imgError, setImgError] = useState(false);
//   const hasImage = radio.image && !radio.image.endsWith("/");

//   if (hasImage && !imgError) {
//     return (
//       <div className={`avatar${isPlaying ? " avatar--playing" : ""}`}>
//         <img
//           src={radio.image}
//           alt={radio.name}
//           onError={() => setImgError(true)}
//           className="avatar__img"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className={`avatar__initials${isPlaying ? " avatar__initials--playing" : ""}`}>
//       {getInitials(radio.name)}
//     </div>
//   );
// };

// // ── Main Component ─────────────────────────────────────────────────────────
// const RadioApp = () => {
//   const [playingId, setPlayingId]   = useState(null);
//   const [search,    setSearch]      = useState("");
//   const [page,      setPage]        = useState(1);
//   const audioRef = useRef(null);
//   const PER_PAGE = 12;

//   const filtered = radiosData.radios.filter((r) => r.name.includes(search));
//   const shown    = filtered.slice(0, page * PER_PAGE);

//   const togglePlay = (radio) => {
//     if (playingId === radio.id) {
//       audioRef.current?.pause();
//       setPlayingId(null);
//       return;
//     }
//     if (audioRef.current) audioRef.current.pause();
//     audioRef.current = new Audio(radio.url);
//     audioRef.current.play().catch(() => {});
//     setPlayingId(radio.id);
//   };

//   const stopAudio = () => {
//     audioRef.current?.pause();
//     setPlayingId(null);
//   };

//   const playingRadio = radiosData.radios.find((r) => r.id === playingId);

//   return (
//     <div className="radio-app">

//       {/* ── Banner ── */}
//       <div className="radio-app__banner-wrap">
//         <img
//           src="/akram_alalaqmi1.jpg"
//           alt="إذاعات القرآن الكريم"
//           className="radio-app__banner-img"
//         />
//       </div>

//       {/* ── كل المحتوى بنفس عرض البانر ── */}
//       <div className="radio-app__inner">

//         {/* ── Now Playing Bar ── */}
//         {playingRadio && (
//           <div className="radio-app__now-playing">
//             <div className="radio-app__now-playing-dot" />
//             <span className="radio-app__now-playing-label">يُبث الآن</span>
//             <span className="radio-app__now-playing-name">{playingRadio.name.trim()}</span>
//             <button className="radio-app__stop-btn" onClick={stopAudio}>■</button>
//           </div>
//         )}

//         {/* ── Search ── */}
//         <div className="radio-app__search-wrap">
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             placeholder="ابحث عن قارئ..."
//             className="radio-app__search-input"
//           />
//           <span className="radio-app__search-icon">🔍</span>
//         </div>

//         {/* ── Grid ── */}
//         <div className="radio-app__grid">
//           {shown.map((radio) => {
//             const isPlaying = playingId === radio.id;
//             return (
//               <div
//                 key={radio.id}
//                 onClick={() => togglePlay(radio)}
//                 className={`radio-card${isPlaying ? " radio-card--playing" : ""}`}
//               >
//                 <Avatar radio={radio} isPlaying={isPlaying} />

//                 <div className="radio-card__name">
//                   <div className="radio-card__name-text">{radio.name.trim()}</div>
//                   <div className="radio-card__subtitle">بث مباشر • HD</div>
//                 </div>

//                 <WaveBars count={6} active={isPlaying} />

//                 <div className="radio-card__play-btn">
//                   <svg viewBox="0 0 16 16" width="16" height="16" fill={isPlaying ? "#c9a84c" : "#2d6b45"}>
//                     {isPlaying
//                       ? <><rect x="3" y="2" width="3.5" height="12" rx="1.5"/><rect x="9.5" y="2" width="3.5" height="12" rx="1.5"/></>
//                       : <path d="M4 2.5l9 5.5-9 5.5z"/>
//                     }
//                   </svg>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ── Load More ── */}
//         {shown.length < filtered.length && (
//           <div className="radio-app__load-more-wrap">
//             <button
//               className="radio-app__load-more-btn"
//               onClick={() => setPage((p) => p + 1)}
//             >
//               عرض المزيد ↓
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default RadioApp;

import React from 'react'

const Test = () => {
  return (
    <div>Test</div>
  )
}

export default Test