import AyaItem from "./AyaItem";

const TOOLTIP_WIDTH = 520;

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
}) => {
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
        if (!chapter) return;
        const globalNumber = chapter.verses_global_range[0] + Number(aya.aya) - 1;
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
            src: `https://cdn.islamic.network/quran/audio/128/ar.husary/${globalNumber}.mp3`,
            ayaText:   aya.arabic_text,
            ayaNumber: aya.aya,
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
                const tooltipLeft    = getLeft(tooltip.x, containerWidth, TOOLTIP_WIDTH);
                const arrowOffset    = Math.max(16, Math.min(tooltip.arrowX - tooltipLeft, TOOLTIP_WIDTH - 16));
                return (
                    <div className="tooltip" style={{ left: tooltipLeft, top: tooltip.y }}>
                        <div className="tooltip__arrow" style={{ left: arrowOffset }} />
                        {tooltip.text}
                    </div>
                );
            })()}

            {/* Verses */}
            <div className="quran-text">
                {verses.map((aya) => {
                    if (!chapter) return null;
                    const globalNumber = chapter.verses_global_range[0] + Number(aya.aya) - 1;
                    return (
                        <AyaItem
                            key={aya.id}
                            aya={aya}
                            currentSura={currentSura}
                            chapter={chapter}
                            isPlaying={player?.globalNumber === globalNumber}
                            isPinned={pin?.suraId === currentSura && pin?.ayaNumber === Number(aya.aya)}
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
