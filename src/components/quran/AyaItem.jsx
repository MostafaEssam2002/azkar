// import { highlightWaqf } from "../utils/quranHelpers";
import { highlightWaqf } from "../../utils/quranHelpers";

const AyaItem = ({ aya, currentSura, chapter, isPlaying, isPinned, onClick, onNumberClick }) => {
    const ayaNum = aya.aya || aya.numberInSurah;
    const arabicText = aya.arabic_text || aya.text || "";
    const suraName = aya.surah?.name || chapter?.name_arabic || "القرآن الكريم";

    return (
        <span
            data-aya=""
            data-aya-num={ayaNum}
            data-page-num={aya.page || ""}
            data-sura-id={currentSura}
            data-sura-name={suraName}
            data-aya-text={arabicText}
            className={`aya${isPinned ? " aya--pinned" : ""}`}
            onClick={onClick}
        >
            {isPinned && (
                <span className="pin-marker">
                    <span className="pin-marker__icon">📌</span>
                    <span className="pin-marker__line" />
                </span>
            )}

            <span className="aya__text">{highlightWaqf(arabicText)}</span>

            <span
                className={`aya__number${isPlaying ? " aya__number--active" : ""}`}
                onClick={onNumberClick}
                title="اضغط لتشغيل الصوت"
            >
                ﴿{ayaNum}﴾
            </span>
        </span>
    );
};

export default AyaItem;
