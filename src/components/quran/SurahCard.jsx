import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const MakkahIcon = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="place-icon">
        <defs>
        <linearGradient id="kaaba-side" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#1a1a1a"}}/>
            <stop offset="100%" style={{stopColor:"#2d2d2d"}}/>
        </linearGradient>
        <linearGradient id="kaaba-front" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#2d2d2d"}}/>
            <stop offset="100%" style={{stopColor:"#0a0a0a"}}/>
        </linearGradient>
        <linearGradient id="kaaba-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#3a3a3a"}}/>
            <stop offset="100%" style={{stopColor:"#222"}}/>
        </linearGradient>
        <linearGradient id="kaaba-goldH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#a07820"}}/>
            <stop offset="40%" style={{stopColor:"#d4a843"}}/>
            <stop offset="60%" style={{stopColor:"#f0c96a"}}/>
            <stop offset="100%" style={{stopColor:"#a07820"}}/>
        </linearGradient>
        <linearGradient id="kaaba-goldH2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#8a6618"}}/>
            <stop offset="40%" style={{stopColor:"#c4983a"}}/>
            <stop offset="60%" style={{stopColor:"#e8b855"}}/>
            <stop offset="100%" style={{stopColor:"#8a6618"}}/>
        </linearGradient>
        <linearGradient id="kaaba-doorGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#c4983a"}}/>
            <stop offset="50%" style={{stopColor:"#f5d070"}}/>
            <stop offset="100%" style={{stopColor:"#c4983a"}}/>
        </linearGradient>
        <linearGradient id="kaaba-sideGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#7a5c10"}}/>
            <stop offset="50%" style={{stopColor:"#c49030"}}/>
            <stop offset="100%" style={{stopColor:"#7a5c10"}}/>
        </linearGradient>
        </defs>

        {/* Top face */}
        <polygon points="100,18 165,50 100,78 35,50" fill="url(#kaaba-top)" stroke="#d4a843" strokeWidth="1"/>

        {/* Right face */}
        <polygon points="165,50 165,148 100,175 100,78" fill="url(#kaaba-side)" stroke="#1a1a1a" strokeWidth="0.5"/>

        {/* Front face */}
        <polygon points="35,50 100,78 100,175 35,148" fill="url(#kaaba-front)" stroke="#1a1a1a" strokeWidth="0.5"/>

        {/* Front top gold band */}
        <polygon points="35,78 100,107 100,118 35,89" fill="url(#kaaba-goldH)"/>

        {/* Front bottom gold band */}
        <polygon points="35,140 100,165 100,175 35,150" fill="url(#kaaba-goldH)"/>

        {/* Front middle kiswa band */}
        <polygon points="35,105 100,132 100,137 35,110" fill="url(#kaaba-goldH2)" opacity="0.7"/>

        {/* Right face gold bands */}
        <polygon points="100,107 165,78 165,89 100,118" fill="url(#kaaba-sideGold)"/>
        <polygon points="100,165 165,140 165,150 100,175" fill="url(#kaaba-sideGold)"/>
        <polygon points="100,132 165,107 165,112 100,137" fill="url(#kaaba-sideGold)" opacity="0.7"/>

        {/* Corner edges */}
        <line x1="100" y1="78" x2="100" y2="175" stroke="#c8a030" strokeWidth="1.5"/>
        <line x1="35" y1="50" x2="35" y2="148" stroke="#8a6618" strokeWidth="0.8"/>
        <line x1="165" y1="50" x2="165" y2="148" stroke="#8a6618" strokeWidth="0.8"/>
        <line x1="35" y1="148" x2="100" y2="175" stroke="#c8a030" strokeWidth="1"/>
        <line x1="100" y1="175" x2="165" y2="148" stroke="#8a6618" strokeWidth="0.8"/>
        <line x1="100" y1="18" x2="35" y2="50" stroke="#d4a843" strokeWidth="1.2"/>
        <line x1="100" y1="18" x2="165" y2="50" stroke="#d4a843" strokeWidth="1.2"/>
    </svg>
);

const MadinahIcon = () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="place-icon">
        <rect width="60" height="60" rx="12" fill="#e8f4e8" />
        <rect x="14" y="32" width="32" height="16" rx="2" fill="#2e7d32" />
        <ellipse cx="30" cy="32" rx="10" ry="10" fill="#388e3c" />
        <ellipse cx="30" cy="32" rx="7" ry="7" fill="#43a047" />
        <rect x="28" y="14" width="4" height="8" rx="2" fill="#1b5e20" />
        <circle cx="30" cy="13" r="2.5" fill="#fdd835" />
        <rect x="16" y="26" width="3" height="6" rx="1" fill="#1b5e20" />
        <ellipse cx="17.5" cy="26" rx="2.5" ry="3" fill="#388e3c" />
        <rect x="41" y="26" width="3" height="6" rx="1" fill="#1b5e20" />
        <ellipse cx="42.5" cy="26" rx="2.5" ry="3" fill="#388e3c" />
        <rect x="22" y="36" width="6" height="12" rx="1" fill="#1b5e20" />
        <rect x="32" y="36" width="6" height="12" rx="1" fill="#1b5e20" />
    </svg>
);

const QuranIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="quran-icon">
        <rect x="3" y="2" width="14" height="20" rx="2" fill="#4caf50" stroke="#2e7d32" strokeWidth="1" />
        <rect x="5" y="4" width="10" height="2" rx="1" fill="#a5d6a7" />
        <rect x="5" y="8" width="10" height="1.5" rx="0.75" fill="#a5d6a7" />
        <rect x="5" y="11" width="8" height="1.5" rx="0.75" fill="#a5d6a7" />
        <rect x="5" y="14" width="10" height="1.5" rx="0.75" fill="#a5d6a7" />
        <rect x="2" y="2" width="2" height="20" rx="1" fill="#2e7d32" />
    </svg>
);

const DecorativeCorner = () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="corner-decor">
        <path d="M0 0 Q30 0 30 30 Q30 0 60 0" stroke="#c8a96e" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M0 10 Q20 10 20 30" stroke="#c8a96e" strokeWidth="0.8" fill="none" opacity="0.3" />
        <circle cx="5" cy="5" r="2" fill="#c8a96e" opacity="0.4" />
        <circle cx="15" cy="3" r="1.5" fill="#c8a96e" opacity="0.3" />
        <circle cx="3" cy="15" r="1.5" fill="#c8a96e" opacity="0.3" />
    </svg>
);

function SurahCard({ surah, audiUrl, reader, surahsList }) {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const isMakki = surah.revelation_place === "makkah";
    const surahsListParam = surahsList ? `&surahs_list=${encodeURIComponent(JSON.stringify(surahsList))}` : '';
    return (
        <div onClick={()=>navigate(`/tilawa/surahsList/play?src=${audiUrl}&arabicTitle=${surah.name_arabic}&surahNumber=${surah.id}&surahName=${surah.name_complex}&reader=${reader}${surahsListParam}`)} className={`surah-card ${isMakki ? "makki" : "madani"}`}>
        <div className="corner corner-tl"><DecorativeCorner /></div>
        <div className="corner corner-tr"><DecorativeCorner /></div>
        <div className="corner corner-bl"><DecorativeCorner /></div>
        <div className="corner corner-br"><DecorativeCorner /></div>
        <div className="card-number">
            <span>{surah.id}</span>
        </div>
        <div className="card-names">
            <h2 className="arabic-name">{surah.name_arabic}</h2>
            <p className="transliteration">{surah.transliteration}</p>
            <p className="translation">{surah.name_complex}</p>
        </div>

        <div className="card-badge">
            <div className="badge-icon">
            {isMakki ? <MakkahIcon /> : <MadinahIcon />}
            </div>
            <div className="badge-text">
            <span className="badge-type">{surah.revelation_place === "makkah" ? "مكية" : "مدنية"}</span>
            <span className="badge-place">{surah.revelation_place === "makkah"? "منزلها مكة" : "منزلها المدينة"}</span>
            </div>
        </div>

        <div className="card-footer">
            <QuranIcon />
            <span className="verses-label">عدد الآيات</span>
            <span className="verses-count">{surah.verses_count}</span>
        </div>
        </div>
    );
}

export default SurahCard;