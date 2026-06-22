import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import chaptersData from "../data/chapters.json";
import usePin from "./usePin";
import useReadingProgress from "./useReadingProgress";
import useReciter from "./useReciter";
import { API_CONFIG, buildApiUrl } from '../config/api';

export const useSurahReading = () => {
    const { pin, savePin, clearPin } = usePin();
    const { currentSura: savedSura, updateReadingProgress } = useReadingProgress();
    const { reciters, loading: recitersLoading, selectedReciter, changeReciter } = useReciter();
    const [searchParams] = useSearchParams();
    const querySura = parseInt(searchParams.get("surah"), 10);

    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0, arrowX: 0 });
    const [player, setPlayer] = useState(null);
    const [currentSura, setCurrentSura] = useState(() => {
        if (!Number.isNaN(querySura) && querySura >= 1 && querySura <= 114) return querySura;
        return pin?.suraId || savedSura || 1;
    });
    const [showBanner, setShowBanner] = useState(true);
    const [toastVisible, setToastVisible] = useState(false);
    const [pinning, setPinning] = useState(false);
    const [shouldScrollToPin, setShouldScrollToPin] = useState(false);

    const toastTimer = useRef(null);
    const readingAreaRef = useRef(null);
    const shouldScrollToReadingRef = useRef(false);

    const chapter = chaptersData.chapters.find((c) => c.id === currentSura);

    useEffect(() => { updateReadingProgress(currentSura); }, [currentSura, updateReadingProgress]);

    useEffect(() => {
        const shouldJump = localStorage.getItem("shouldJumpToPin");
        if (shouldJump === "true" && pin) {
            setShouldScrollToPin(true);
            localStorage.removeItem("shouldJumpToPin");
        }
    }, [pin]);

    useEffect(() => {
        setLoading(true);
        setTooltip((prev) => ({ ...prev, visible: false }));
        setPlayer(null);
        fetch(buildApiUrl(API_CONFIG.quranEnc, `translation/sura/arabic_moyassar/${currentSura}`))
            .then((r) => r.json())
            .then((data) => { setVerses(data.result); setLoading(false); });
    }, [currentSura]);

    useEffect(() => {
        if (!Number.isNaN(querySura) && querySura >= 1 && querySura <= 114 && querySura !== currentSura) {
            setCurrentSura(querySura);
        }
    }, [querySura]);

    useEffect(() => { if (pin) setShowBanner(true); }, [pin]);

    const scrollToReadingArea = useCallback(() => {
        const tryScroll = () => {
            if (readingAreaRef.current) {
                const top = readingAreaRef.current.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                return;
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        requestAnimationFrame(() => {
            tryScroll();
            setTimeout(tryScroll, 300);
            setTimeout(tryScroll, 800);
        });
    }, []);

    useEffect(() => {
        if (!shouldScrollToReadingRef.current || loading || verses.length === 0) return;
        shouldScrollToReadingRef.current = false;
        scrollToReadingArea();
    }, [currentSura, loading, verses.length, scrollToReadingArea]);

    useEffect(() => {
        if (pin && currentSura !== pin.suraId) setCurrentSura(pin.suraId);
    }, [pin?.suraId]);

    useEffect(() => {
        if (!shouldScrollToPin || loading || !pin || currentSura !== pin.suraId) return;
        const selector = `[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`;
        const timer = setTimeout(() => {
            const el = document.querySelector(selector);
            if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); setShouldScrollToPin(false); return; }
            const retryTimer = setTimeout(() => {
                document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "center" });
                setShouldScrollToPin(false);
            }, 500);
            return () => clearTimeout(retryTimer);
        }, 500);
        return () => clearTimeout(timer);
    }, [shouldScrollToPin, loading, pin, currentSura]);

    const showToast = useCallback(() => {
        setToastVisible(true);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
    }, []);

    const handlePinDrop = useCallback(({ ayaNumber, suraId, suraName, ayaText }) => {
        savePin({ ayaNumber, suraId, suraName, ayaText });
        setShowBanner(true);
        showToast();
    }, [savePin, showToast]);

    const jumpToPin = useCallback(() => {
        if (!pin) return;
        if (pin.suraId === currentSura) {
            if (!loading) {
                document.querySelector(`[data-aya-num="${pin.ayaNumber}"][data-sura-id="${pin.suraId}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                setShouldScrollToPin(true);
            }
        } else {
            setShouldScrollToPin(true);
            setCurrentSura(pin.suraId);
        }
    }, [pin, currentSura, loading]);

    const goToPrevious = useCallback(() => {
        if (currentSura > 1) { shouldScrollToReadingRef.current = true; setCurrentSura(s => s - 1); }
    }, [currentSura]);

    const goToNext = useCallback(() => {
        if (currentSura < 114) { shouldScrollToReadingRef.current = true; setCurrentSura(s => s + 1); }
    }, [currentSura]);

    return {
        // data
        chapter, verses, loading,
        // sura
        currentSura, setCurrentSura,
        // reciter
        reciters, recitersLoading, selectedReciter, changeReciter,
        // pin
        pin, clearPin, showBanner, setShowBanner,
        pinning, setPinning,
        handlePinDrop, jumpToPin,
        // player
        player, setPlayer,
        // tooltip
        tooltip, setTooltip,
        // toast
        toastVisible,
        // refs
        readingAreaRef,
        // navigation
        goToPrevious, goToNext,
    };
};