import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Search, X } from "lucide-react";
import chaptersData from "../../data/chapters.json";

const SuraSelector = ({ currentSura, onChange }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const popupRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            setSearch("");
        }
    }, [open]);

    const currentChapter = chaptersData.chapters.find((chapter) => chapter.id === currentSura);

    const filteredChapters = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return chaptersData.chapters;

        return chaptersData.chapters.filter((chapter) => {
            const searchableText = [
                chapter.id,
                chapter.name_arabic,
                chapter.name_complex,
                chapter.transliteration,
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [search]);

    const handleSelect = (id) => {
        onChange(Number(id));
        setOpen(false);
    };

    return (
        <>
            <div className="selector-wrapper">
                <button
                    type="button"
                    className="sura-selector__trigger"
                    onClick={() => setOpen(true)}
                >
                    <span className="sura-selector__trigger-icon">
                        <BookOpen size={18} />
                    </span>
                    <span className="sura-selector__trigger-text">
                        <span className="sura-selector__trigger-label">اختر السورة</span>
                        <span className="sura-selector__trigger-value">
                            {currentChapter ? `${currentChapter.id}. ${currentChapter.name_arabic}` : ""}
                        </span>
                    </span>
                </button>
            </div>

            {open && createPortal(
                <div className="sura-selector__overlay">
                    <div className="sura-selector__popup" ref={popupRef}>
                        <div className="sura-selector__header">
                            <span className="sura-selector__title">اختر السورة</span>
                            <button
                                type="button"
                                className="sura-selector__close"
                                onClick={() => setOpen(false)}
                                aria-label="إغلاق القائمة"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="sura-selector__search">
                            <Search size={16} className="sura-selector__search-icon" />
                            <input
                                type="text"
                                autoFocus
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="ابحث عن السورة أو رقمها..."
                                className="sura-selector__search-input"
                            />
                        </div>

                        <div className="sura-selector__list">
                            {filteredChapters.length === 0 ? (
                                <div className="sura-selector__empty">لا توجد نتائج</div>
                            ) : (
                                filteredChapters.map((chapter) => (
                                    <button
                                        type="button"
                                        key={chapter.id}
                                        className={`sura-selector__item ${chapter.id === currentSura ? "is-active" : ""}`}
                                        onClick={() => handleSelect(chapter.id)}
                                    >
                                        <span className="sura-selector__item-number">{chapter.id}</span>
                                        <span className="sura-selector__item-text">
                                            <span className="sura-selector__item-arabic">{chapter.name_arabic}</span>
                                            <span className="sura-selector__item-english">{chapter.name_complex}</span>
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default SuraSelector;
