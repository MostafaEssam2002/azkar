import { useEffect, useRef, useState, useCallback } from "react";
import chaptersData from "../data/chapters.json";
import usePin        from "../hooks/usePin";
import FloatingPin from './../components/quran/FloatingPin';
import PinBanner from './../components/quran/PinBanner';
import MiniPlayer from './../components/quran/MiniPlayer';
import PinToast from './../components/quran/PinToast';
import QuranHeader from './../components/quran/QuranHeader';
import SuraSelector from './../components/quran/SuraSelector';
import QuranView from './../components/quran/QuranView';

const SurahForReading = () => {
    const [verses,  setVerses]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0, arrowX: 0 });
    const [player, setPlayer] = useState(null);
    const [currentSura, setCurrentSura] = useState(22);
    const [showBanner, setShowBanner] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [pinning, setPinning] = useState(false);
    const toastTimer = useRef(null);
    const { pin, savePin, clearPin } = usePin();
    const chapter = chaptersData.chapters.find((c) => c.id === currentSura);
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
        const doScroll = () => {
            const el = document.querySelector(
                `[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`
            );
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        if (pin.suraId !== currentSura) {
            setCurrentSura(pin.suraId);
            setTimeout(doScroll, 900);
        } else {
            doScroll();
        }
    }, [pin, currentSura]);

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
            <QuranHeader chapter={chapter} />
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
        </div>
    );
};
export default SurahForReading;