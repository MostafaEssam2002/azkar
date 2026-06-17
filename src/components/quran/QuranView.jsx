import AyaItem from "./AyaItem";

const TOOLTIP_WIDTH = 520;
const RECITER_STORAGE_KEY = "selectedReciterIdentifier";
const DEFAULT_RECITER = "ar.husary";

const getLeft = (x, cw, w) => {
    let l = x - w / 2;
    if (l < 8) l = 8;
    if (l + w > cw - 8) l = cw - w - 8;
    return l;
};

const QuranView = ({
    verses, chapter, currentSura, loading,
    tooltip, setTooltip,
    player, setPlayer,
    pin,
    selectedReciter,
}) => {
    const reciter = selectedReciter || localStorage.getItem(RECITER_STORAGE_KEY) || DEFAULT_RECITER;
    const handleClick = (e, aya) => {
        if (tooltip.visible && tooltip.text === aya.translation) {
            setTooltip((prev) => ({ ...prev, visible: false }));
            return;
        }
        setPlayer(null);
        const containerRect = e.currentTarget.closest("[data-quran-container]").getBoundingClientRect();
        const clickX = e.clientX - containerRect.left;
        const clickY = e.clientY - containerRect.top;
        setTooltip({ visible: true, text: aya.translation, x: clickX, y: clickY, arrowX: clickX });
    };

    const handleNumberClick = (e, aya) => {
        e.stopPropagation();
        const globalNumber = Number(aya.globalNumber || aya.number || (chapter?.verses_global_range ? chapter.verses_global_range[0] + Number(aya.aya || aya.numberInSurah) - 1 : 0));
        if (!globalNumber) return;
        const ayaEl = e.currentTarget.closest("[data-aya]");
        const rect  = ayaEl ? ayaEl.getBoundingClientRect() : e.currentTarget.getBoundingClientRect();
        const PW    = Math.min(320, window.innerWidth - 16);
        let x = rect.left + rect.width / 2 - PW / 2;
        x = Math.max(8, Math.min(window.innerWidth - PW - 8, x));
        const PLAYER_H_EST = 170;
        let y = rect.top - PLAYER_H_EST - 10;
        if (y < 8) y = rect.bottom + 10;

        setTooltip((prev) => ({ ...prev, visible: false }));
        if (player?.globalNumber === globalNumber) { setPlayer(null); return; }
        setPlayer({
            globalNumber,
            src: `https://alfurqan.online/api/v1/audio/${reciter}/${globalNumber}`,
            ayaText:   aya.arabic_text || aya.text,
            ayaNumber: aya.aya || aya.numberInSurah,
            x,
            y,
        });
    };

    if (loading) return <div className="loading">جارٍ التحميل...</div>;

    return (
        <div
            className="quran-wrapper"
            data-quran-container=""
            onClick={(e) => {
                if (!e.target.closest("[data-aya]"))
                    setTooltip((prev) => ({ ...prev, visible: false }));
            }}
        >
            {chapter?.bismillah_pre && (
                <div className="bismillah-inner">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            )}

            {/* Tooltip */}
            {tooltip.visible && (() => {
                const wrapperEl      = document.querySelector("[data-quran-container]");
                const containerWidth = wrapperEl ? wrapperEl.offsetWidth : 900;
                const tooltipWidth = Math.max(220, Math.min(TOOLTIP_WIDTH, containerWidth - 16));
                const tooltipLeft    = getLeft(tooltip.x, containerWidth, tooltipWidth);
                const arrowOffset    = Math.max(12, Math.min(tooltip.arrowX - tooltipLeft, tooltipWidth - 16));
                return (
                    <div className="tooltip" style={{ left: tooltipLeft, top: tooltip.y, width: tooltipWidth }}>
                        <div className="tooltip__arrow" style={{ left: arrowOffset }} />
                        {tooltip.text}
                    </div>
                );
            })()}

            {/* Verses */}
            <div className="quran-text">
                {verses.map((aya) => {
                    const globalNumber = Number(aya.globalNumber || aya.number || (chapter?.verses_global_range ? chapter.verses_global_range[0] + Number(aya.aya || aya.numberInSurah) - 1 : 0));
                    const ayaSuraId = Number(aya.sura || (aya.surah && (aya.surah.number || aya.surah.id)) || currentSura);
                    return (
                        <AyaItem
                            key={aya.id}
                            aya={aya}
                            currentSura={ayaSuraId}
                            chapter={chapter}
                            isPlaying={player?.globalNumber === globalNumber}
                            isPinned={pin?.suraId === ayaSuraId && pin?.ayaNumber === Number(aya.aya || aya.numberInSurah)}
                            onClick={(e) => handleClick(e, aya)}
                            onNumberClick={(e) => handleNumberClick(e, aya)}
                        />
                    );
                })}
            </div>

            <div className="hint">
                ✦ اضغط على نص الآية لعرض التفسير · اضغط على الرقم ﴿﴾ لتشغيل الصوت · اسحب 📌 على أي آية لحفظ موقفك
            </div>
        </div>
    );
};

export default QuranView;