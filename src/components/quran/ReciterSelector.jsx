import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Settings, Check, X, Search } from "lucide-react";

const ReciterSelector = ({ reciters, selectedReciter, onChange, loading }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const popupRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // منع scroll الصفحة وقت ما الـ popup مفتوح + تصفير البحث عند القفل
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setSearch("");
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const currentReciter = (reciters || []).find((r) => r.id === selectedReciter);

    const filteredReciters = (reciters || []).filter((r) =>
        r.arabicName.toLowerCase().includes(search.trim().toLowerCase())
    );

    const handleSelect = (id) => {
        onChange(id);
        setOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="surah-hero__card reciter-selector__trigger"
                onClick={() => setOpen(true)}
                disabled={loading}
            >
                <div className="surah-hero__card-icon">
                    <Settings size={20} />
                </div>
                <span className="surah-hero__card-text">
                    {loading ? "جاري التحميل..." : (currentReciter?.arabicName || "اختر القارئ")}
                </span>
            </button>

            {open && createPortal(
                <div className="reciter-popup-overlay">
                    <div className="reciter-popup" ref={popupRef}>
                        <div className="reciter-popup__header">
                            <span className="reciter-popup__title">اختر القارئ</span>
                            <button className="reciter-popup__close" onClick={() => setOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="reciter-popup__search">
                            <Search size={16} className="reciter-popup__search-icon" />
                            <input
                                type="text"
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="ابحث عن القارئ..."
                                className="reciter-popup__search-input"
                            />
                        </div>

                        <div className="reciter-popup__list">
                            {filteredReciters.length === 0 && (
                                <div className="reciter-popup__empty">لا توجد نتائج</div>
                            )}
                            {filteredReciters.map((reciter) => (
                                <button
                                    key={reciter.id}
                                    type="button"
                                    className={`reciter-popup__item ${reciter.id === selectedReciter ? "reciter-popup__item--active" : ""}`}
                                    onClick={() => handleSelect(reciter.id)}
                                >
                                    <span className="reciter-popup__item-name">{reciter.arabicName}</span>
                                    {reciter.id === selectedReciter && (
                                        <Check size={16} className="reciter-popup__item-check" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ReciterSelector;