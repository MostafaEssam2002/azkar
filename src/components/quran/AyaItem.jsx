// import { highlightWaqf } from "../utils/quranHelpers";
import { highlightWaqf } from "../../utils/quranHelpers";

const AyaItem = ({ aya, currentSura, chapter, isPlaying, isPinned, onClick, onNumberClick }) => (
    <span
        data-aya=""
        data-aya-num={aya.aya}
        data-sura-id={currentSura}
        data-sura-name={chapter?.name_arabic}
        data-aya-text={aya.arabic_text}
        className={`aya${isPinned ? " aya--pinned" : ""}`}
        onClick={onClick}
    >
        {isPinned && (
            <span className="pin-marker">
                <span className="pin-marker__icon">📌</span>
                <span className="pin-marker__line" />
            </span>
        )}

        <span className="aya__text">{highlightWaqf(aya.arabic_text)}</span>

        <span
            className={`aya__number${isPlaying ? " aya__number--active" : ""}`}
            onClick={onNumberClick}
            title="اضغط لتشغيل الصوت"
        >
            ﴿{aya.aya}﴾
        </span>
    </span>
);

export default AyaItem;
