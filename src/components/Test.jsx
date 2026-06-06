import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import usePin from "../hooks/usePin";
import useWird from "./test/useWird";
import QuranView from './quran/QuranView';
import PinBanner from './quran/PinBanner';
import QuranHeader from './quran/QuranHeader';
import PinToast from './quran/PinToast';
import MiniPlayer from './quran/MiniPlayer';
import FloatingPin from './quran/FloatingPin';
import WirdSettingsPopup from './test/WirdSettingsPopup';
import WirdScoreBar from './test/WirdScoreBar';
import CompletionPopup from './test/CompletionPopup';
import Fireworks from './test/Fireworks';
import chaptersData from '../data/chapters.json';
import "./test/wird-system.scss";
import "./test/surah-separator.scss"; // فاصل السور

const TOTAL_PAGES = 604;
const TIME_SCALE = 1 / 1440; // 1 يوم = 1 دقيقة (1440 دقيقة في اليوم)

/* ── SurahSeparator ──────────────────────────────────────────────────────────
 * يُعرض بين السور داخل نفس الصفحة.
 * إذا كانت QuranView تعرض الـ verses بنفسها، يجب تعديلها لتتعرف على
 * items بـ type === "surah-header" وتعرض هذا المكوّن بدلاً من آية عادية.
 * ─────────────────────────────────────────────────────────────────────────── */
function SurahSeparator({ surahName, surahEnglishName, showBasmala }) {
    return (
        <div className="surah-separator" dir="rtl">
            <div className="surah-separator__name-row">
                <span className="surah-separator__name-ar">{surahName}</span>
                <span className="surah-separator__name-en">{surahEnglishName}</span>
            </div>
            
            <div className="surah-separator__divider" />
        </div>
    );
}
const QuranPageReader = () => {
    const [verses,         setVerses]       = useState([]);
    const [loading,        setLoading]      = useState(true);
    const [tooltip,        setTooltip]      = useState({ visible: false, text: "", x: 0, y: 0, arrowX: 0 });
    const [player,         setPlayer]       = useState(null);
    const [currentPage,    setCurrentPage]  = useState(1);
    const [rangeStart,     setRangeStart]   = useState(1);
    const [rangeEnd,       setRangeEnd]     = useState(1);
    const [pageInfo,       setPageInfo]     = useState(null);
    const [showBanner,     setShowBanner]   = useState(true);
    const [toastVisible,   setToastVisible] = useState(false);
    const [pinning,        setPinning]      = useState(false);
    const [startPageInput, setStartPageInput] = useState("1");
    const [endPageInput,   setEndPageInput]   = useState("1");
    const [showCompletionPopup, setShowCompletionPopup] = useState(false);
    const [showFireworks,   setShowFireworks] = useState(false);

    const cache       = useRef({});
    const tafsirCache = useRef({});
    const toastTimer  = useRef(null);
    const completionShownRef = useRef(false);

    const { pin, savePin, clearPin } = usePin("quran_wird_pin");

    // ── Wird hook ─────────────────────────────────────────────────────────────
    const {
        settings: wirdSettings,
        saveSettings: saveWirdSettings,
        activeRange,
        score,
        isComplete,
        markPageRead,
        finishCatchUp,
        missedDays,
        isCatchingUp,
        currentDayIndex,
        forceCheckUpdate,
        accumulatedMissedPages,
        moveToNextWird,
        completeLastWird,
        markComplete,
        markLastPageComplete,
        resetWird,
        lastSettingsUpdateTime,
    } = useWird(currentPage);

    // ── When wird range changes, sync the page selector ──────────────────────
    useEffect(() => {
        if (!activeRange) return;
        setRangeStart(activeRange.start);
        setRangeEnd(activeRange.end);
        setStartPageInput(String(activeRange.start));
        setEndPageInput(String(activeRange.end));
        setCurrentPage(activeRange.start);
        
        // حذف الـ pin عند تغيير الورد (سواء تلقائياً أو يدويّاً)
        localStorage.removeItem("quran_wird_pin");
        clearPin();
        
        fetchPages(activeRange.start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRange?.start, activeRange?.end, clearPin]);

    // ── Fetch one page at a time ──────────────────────────────────────────────
    const fetchPages = useCallback(async (page) => {
        setLoading(true);
        setTooltip(prev => ({ ...prev, visible: false }));
        setPlayer(null);

        const requestedPage = Math.min(TOTAL_PAGES, Math.max(1, Number(page) || 1));

        if (cache.current[requestedPage]) {
            const pageData = cache.current[requestedPage];
            const allAyahs = buildAyahs(pageData);
            setVerses(allAyahs);
            setPageInfo(pageData);
            setCurrentPage(requestedPage);
            setLoading(false);
            return;
        }

        try {
            const res  = await fetch(`https://api.quranhub.com/v1/page/${requestedPage}`);
            const data = await res.json();
            const pageData = data.data;
            cache.current[requestedPage] = pageData;

            const suraIds = [...new Set(pageData.ayahs.map(a => a.surah?.number).filter(Boolean))];
            await Promise.all(suraIds.map(fetchTafsir));

            const allAyahs = buildAyahs(pageData);
            setVerses(allAyahs);
            setPageInfo(pageData);
            setCurrentPage(requestedPage);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching page:", error);
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTafsir = useCallback(async (suraId) => {
        if (tafsirCache.current[suraId]) return;
        try {
            const res  = await fetch(`https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${suraId}`);
            const data = await res.json();
            const map  = {};
            if (data.result) data.result.forEach(item => { map[Number(item.aya)] = item.translation; });
            tafsirCache.current[suraId] = map;
        } catch (err) {
            console.error(`Tafsir fetch error sura ${suraId}:`, err);
        }
    }, []);

    const buildAyahs = useCallback((pageData) => {
        const result = [];
        let lastSurahNumber = null;

        pageData.ayahs.forEach(aya => {
            const suraId     = aya.surah?.number;
            const ayaNum     = aya.numberInSurah;
            const tafsirText = (tafsirCache.current[suraId]?.[ayaNum])
                || `سورة ${aya.surah?.name || ""} - آية ${aya.numberInSurah} - صفحة ${aya.page}`;

            // أضف header السورة عند أول آية من كل سورة جديدة
            if (suraId !== lastSurahNumber) {
                lastSurahNumber = suraId;
                // البسملة تظهر مع كل سورة ما عدا سورة التوبة (9) والفاتحة (1) لأن بسملتها جزء من آياتها
                const showBasmala = suraId !== 9 && ayaNum === 1;
                result.push({
                    type: "surah-header",
                    id: `surah-header-${suraId}`,
                    surahNumber: suraId,
                    surahName: aya.surah?.name || "",
                    surahEnglishName: aya.surah?.englishName || "",
                    showBasmala,
                });
            }

            result.push({
                ...aya,
                id: aya.number,
                aya: aya.numberInSurah,
                arabic_text: aya.text,
                translation: tafsirText,
                type: "ayah",
            });
        });

        return result;
    }, []);

    // ── Initial load ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!activeRange) fetchPages(1);
    }, [fetchPages, activeRange]);

    useEffect(() => { if (pin) setShowBanner(true); }, [pin]);

    // ── Mark current page read in wird ───────────────────────────────────────
    useEffect(() => {
        if (!loading && activeRange && currentPage >= activeRange.start && currentPage <= activeRange.end) {
            markPageRead(currentPage);
        }
    }, [currentPage, loading, activeRange, markPageRead]);

    // ── Handle completion when user clicks "إنهاء الورد" button ─────────────
    const handleMoveToNext = useCallback(() => {
        localStorage.removeItem("quran_wird_pin");
        clearPin();
        moveToNextWird();
    }, [clearPin, moveToNextWird]);

    const handleFinishCatchUp = useCallback(() => {
        localStorage.removeItem("quran_wird_pin");
        clearPin();
        finishCatchUp();
    }, [clearPin, finishCatchUp]);

    // ── Handle automatic wird update when time expires ───────────────────────
    const handleTimeExpired = useCallback(() => {
        localStorage.removeItem("quran_wird_pin");
        clearPin();
        forceCheckUpdate();
    }, [clearPin, forceCheckUpdate]);

    const handleCompletionClick = useCallback(() => {
        // Show celebration ONLY at page 604 (end of Quran)
        if (currentPage === TOTAL_PAGES && !completionShownRef.current) {
            completionShownRef.current = true;
            
            // Show celebration
            setShowFireworks(true);
            setShowCompletionPopup(true);
            
            // Clear all wird data and saved pin from localStorage for fresh start
            localStorage.removeItem("wird_settings");
            localStorage.removeItem("wird_progress");
            localStorage.removeItem("quran_wird_pin");
            clearPin();
            
            // Also clear any interval that might be running
            if (window.wirdUpdateInterval) {
                clearInterval(window.wirdUpdateInterval);
                window.wirdUpdateInterval = null;
            }
        }
        
        // Mark the wird as complete (this happens regardless of page)
        markComplete();
    }, [currentPage, markComplete]);

    // ── Toast ─────────────────────────────────────────────────────────────────
    const showToast = useCallback(() => {
        setToastVisible(true);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
    }, []);

    // ── Pin ───────────────────────────────────────────────────────────────────
    const handlePinDrop = useCallback(({ ayaNumber, pageNumber, suraId, suraName, ayaText }) => {
        savePin({ ayaNumber, pageNumber, suraId, suraName, ayaText });
        setShowBanner(true);
        showToast();
    }, [savePin, showToast]);

    const jumpToPin = useCallback(() => {
        if (!pin) return;
        let targetPage = Number(pin.pageNumber) || null;
        if (!targetPage) {
            for (let p = Math.max(1, currentPage - 5); p <= Math.min(TOTAL_PAGES, currentPage + 5); p++) {
                if (cache.current[p]?.ayahs?.some(a => a.numberInSurah === pin.ayaNumber && a.surah?.number === pin.suraId)) {
                    targetPage = p; break;
                }
            }
        }
        if (!targetPage) targetPage = rangeStart || 1;
        const doScroll = () => {
            document.querySelector(`[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
        };
        if (targetPage === currentPage) { doScroll(); return; }
        fetchPages(targetPage);
        setTimeout(doScroll, 1500);
    }, [pin, currentPage, rangeStart, fetchPages]);

    // ── Manual range submit ───────────────────────────────────────────────────
    const handleSubmit = useCallback(() => {
        const rawStart = Number(startPageInput) || 1;
        const rawEnd   = Number(endPageInput)   || rawStart;
        const start = Math.min(TOTAL_PAGES, Math.max(1, rawStart));
        const end   = Math.min(TOTAL_PAGES, Math.max(1, rawEnd));
        const from  = Math.min(start, end);
        const to    = Math.max(start, end);
        setRangeStart(from); setRangeEnd(to);
        setCurrentPage(from);
        setStartPageInput(String(from)); setEndPageInput(String(to));
        fetchPages(from);
    }, [startPageInput, endPageInput, fetchPages]);

    const handlePrevRange = useCallback(() => {
        if (currentPage <= rangeStart) return;
        fetchPages(currentPage - 1);
    }, [currentPage, fetchPages, rangeStart]);

    const handleNextRange = useCallback(() => {
        if (currentPage >= rangeEnd) return;
        const nextPage = currentPage + 1;
        fetchPages(nextPage);
    }, [currentPage, fetchPages, rangeEnd]);

    // ── Chapter ───────────────────────────────────────────────────────────────
    const chapter = useMemo(() => {
        if (!pageInfo?.topPageSurah?.number) return null;
        const found = chaptersData.chapters.find(c => c.id === pageInfo.topPageSurah.number);
        return found || null;
    }, [pageInfo]);

    /**
     * groupedVerses: Array من السور، كل سورة عبارة عن:
     * {
     *   surahNumber, surahName, surahEnglishName, showBasmala,
     *   ayahs: [...] ← الآيات الخاصة بها في هذه الصفحة
     * }
     *
     * ملاحظة: QuranView يستقبل verses كـ flat array تحتوي على items من نوعين:
     *   • { type: "surah-header", surahNumber, surahName, showBasmala, ... }
     *   • { type: "ayah", ...بيانات الآية }
     * يجب تعديل QuranView ليتعامل مع النوعين (راجع التعليق أدناه).
     */
    const groupedVerses = useMemo(() => {
        const groups = [];
        let current = null;
        verses.forEach(item => {
            if (item.type === "surah-header") {
                current = { ...item, ayahs: [] };
                groups.push(current);
            } else if (current) {
                current.ayahs.push(item);
            }
        });
        return groups;
    }, [verses]);

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
            
            {/* ── Celebration Components ────────────────────────────────── */}
            <Fireworks active={showFireworks} />
            <CompletionPopup 
                visible={showCompletionPopup} 
                onClose={() => {
                    resetWird();
                    setShowCompletionPopup(false);
                    setShowFireworks(false);
                    completionShownRef.current = false;
                }}
            />

            {/* ── Wird Score Bar ─────────────────────────────────────────── */}
            <WirdScoreBar
                score={score}
                isComplete={isComplete}
                activeRange={activeRange}
                missedDays={missedDays}
                isCatchingUp={isCatchingUp}
                onFinishCatchUp={handleFinishCatchUp}
                currentDayIndex={currentDayIndex}
                settings={wirdSettings}
                onSaveSettings={saveWirdSettings}
                accumulatedMissedPages={accumulatedMissedPages}
                onMoveToNext={handleMoveToNext}
                onCompleteLastWird={completeLastWird}
                onMarkComplete={markComplete}
                onTimeExpired={handleTimeExpired}
                lastSettingsUpdateTime={lastSettingsUpdateTime}
                currentPage={currentPage}
            />

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

            {/*
             * ── Quran Content ──────────────────────────────────────────────
             * نعرض كل سورة منفصلة مع BismAllah بينها.
             * QuranView تستقبل verses (فقط آيات السورة الواحدة) ونمررها لكل group.
             */}
            {groupedVerses.map(group => (
                <div key={group.id} className="surah-group">
                    <SurahSeparator
                        surahName={group.surahName}
                        surahEnglishName={group.surahEnglishName}
                        showBasmala={group.showBasmala}
                    />
                    <QuranView
                        verses={group.ayahs}
                        chapter={chapter}
                        currentSura={currentPage}
                        loading={loading}
                        tooltip={tooltip}
                        setTooltip={setTooltip}
                        player={player}
                        setPlayer={setPlayer}
                        pin={pin}
                    />
                </div>
            ))}

            {/* ── Pagination ─────────────────────────────────────────────── */}
            {!loading && (
                <div className="pagination" dir="rtl">
                    <button className="pagination-btn prev-btn" onClick={handlePrevRange} disabled={currentPage <= rangeStart}>
                        <i className="fa-solid fa-chevron-right" /> السابق
                    </button>
                    <div className="page-number active">
                        الصفحة {currentPage} من {rangeEnd}
                    </div>
                    {currentPage >= rangeEnd ? (
                        <button className="pagination-btn next-btn" onClick={handleCompletionClick}>
                            إنهاء الورد ✓
                        </button>
                    ) : (
                        <button className="pagination-btn next-btn" onClick={handleNextRange} disabled={currentPage >= rangeEnd}>
                            التالي <i className="fa-solid fa-chevron-left" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuranPageReader;
