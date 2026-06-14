import { useEffect, useRef, useState, useCallback } from "react";
import chaptersData from "../data/chapters.json";
import usePin        from "../hooks/usePin";
import useReadingProgress from "../hooks/useReadingProgress";
import FloatingPin from './../components/quran/FloatingPin';
import PinBanner from './../components/quran/PinBanner';
import MiniPlayer from './../components/quran/MiniPlayer';
import PinToast from './../components/quran/PinToast';
import SurahHero from './../components/quran/SurahHero';
import SuraSelector from './../components/quran/SuraSelector';
import QuranView from './../components/quran/QuranView';
import SurahNavigation from './../components/quran/SurahNavigation';

const SurahForReading = () => {
    const { pin, savePin, clearPin } = usePin();
    const { currentSura: savedSura, updateReadingProgress } = useReadingProgress();
    
    const [verses,  setVerses]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0, arrowX: 0 });
    const [player, setPlayer] = useState(null);
    const [currentSura, setCurrentSura] = useState(pin?.suraId || savedSura || 1);
    const [showBanner, setShowBanner] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [pinning, setPinning] = useState(false);
    const [shouldScrollToPin, setShouldScrollToPin] = useState(false);
    const toastTimer = useRef(null);
    const chapter = chaptersData.chapters.find((c) => c.id === currentSura);
    
    // ── Save reading progress on sura change ─────────────────────────────────
    useEffect(() => {
        updateReadingProgress(currentSura);
    }, [currentSura, updateReadingProgress]);
    
    // ── Check for jump flag from Home page ───────────────────────────────────
    useEffect(() => {
        const shouldJump = localStorage.getItem("shouldJumpToPin");
        if (shouldJump === "true" && pin) {
            setShouldScrollToPin(true);
            localStorage.removeItem("shouldJumpToPin");
        }
    }, [pin]);
    
    // ── Fetch verses on sura change ──────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setTooltip((prev) => ({ ...prev, visible: false }));
        setPlayer(null);
        fetch(`https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${currentSura}`)
            .then((r) => r.json())
            .then((data) => { setVerses(data.result); setLoading(false); });
    }, [currentSura]);

    useEffect(() => {
        if (pin) setShowBanner(true);
    }, [pin]);

    // ── Auto navigate to pin sura when pin changes ──────────────────────────
    useEffect(() => {
        if (pin && currentSura !== pin.suraId) {
            setCurrentSura(pin.suraId);
        }
    }, [pin?.suraId]);

    // ── Scroll to pin when data is loaded ────────────────────────────────────
    useEffect(() => {
        if (shouldScrollToPin && !loading && pin && currentSura === pin.suraId) {
            // انتظر قليلاً لضمان عرض الآيات في الـ DOM
            const timer = setTimeout(() => {
                const el = document.querySelector(
                    `[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`
                );
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    setShouldScrollToPin(false);
                } else {
                    // في حالة عدم العثور على الآية، حاول مرة أخرى بعد قليل
                    const retryTimer = setTimeout(() => {
                        const retryEl = document.querySelector(
                            `[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`
                        );
                        if (retryEl) {
                            retryEl.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                        setShouldScrollToPin(false);
                    }, 500);
                    return () => clearTimeout(retryTimer);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [shouldScrollToPin, loading, pin, currentSura]);

    // ── Toast helper ─────────────────────────────────────────────────────────
    const showToast = useCallback(() => {
        setToastVisible(true);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
    }, []);

    // ── Pin handlers ─────────────────────────────────────────────────────────
    const handlePinDrop = useCallback(({ ayaNumber, suraId, suraName, ayaText }) => {
        savePin({ ayaNumber, suraId, suraName, ayaText });
        setShowBanner(true);
        showToast();
    }, [savePin, showToast]);

    const jumpToPin = useCallback(() => {
        if (!pin) return;
        
        // إذا كانت السورة الحالية هي نفس السورة المحفوظة
        if (pin.suraId === currentSura) {
            // الآيات محملة بالفعل، عمل scroll فوراً
            if (!loading) {
                const el = document.querySelector(
                    `[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`
                );
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                // إذا كانت تحميل، حدد flag للقيام بـ scroll عند اكتمال التحميل
                setShouldScrollToPin(true);
            }
        } else {
            // السورة مختلفة، غير السورة وضع flag للقيام بـ scroll بعد التحميل
            setShouldScrollToPin(true);
            setCurrentSura(pin.suraId);
        }
    }, [pin, currentSura, loading]);

    return (
        <div className="page">
            <FloatingPin onDropped={handlePinDrop} pinning={pinning} setPinning={setPinning} />
            {player && (
                <MiniPlayer
                    key={player.globalNumber}
                    src={player.src}
                    ayaText={player.ayaText}
                    ayaNumber={player.ayaNumber}
                    onClose={() => setPlayer(null)}
                    initialX={player.x}
                    initialY={player.y}
                />
            )}
            <PinToast visible={toastVisible} />
            <SurahHero chapter={chapter} />
            <SuraSelector currentSura={currentSura} onChange={setCurrentSura} />
            {pin && showBanner && (
                <div className="pin-banner-wrapper">
                    <PinBanner
                        pin={pin}
                        onJump={jumpToPin}
                        onClear={() => { clearPin(); setShowBanner(false); }}
                        onDismiss={() => setShowBanner(false)}
                    />
                </div>
            )}
            <QuranView
                verses={verses}
                chapter={chapter}
                currentSura={currentSura}
                loading={loading}
                tooltip={tooltip}
                setTooltip={setTooltip}
                player={player}
                setPlayer={setPlayer}
                pin={pin}
            />
            
            <SurahNavigation
                currentSura={currentSura}
                onPrevious={() => {
                    if (currentSura > 1) {
                        setCurrentSura(currentSura - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}
                onNext={() => {
                    if (currentSura < 114) {
                        setCurrentSura(currentSura + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}
            />
        </div>
    );
};
export default SurahForReading;