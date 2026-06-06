const PinBanner = ({ pin, onJump, onClear, onDismiss }) => {
    const formattedDate = new Date(pin.savedAt).toLocaleString("ar-EG", {
        dateStyle: "short", timeStyle: "short",
    });

    return (
        <div className="pin-banner">
            <div className="pin-banner__left">
                <span className="pin-banner__icon">📌</span>
                <div>
                    <div className="pin-banner__title">
                        آخر موقف · سورة {pin.suraName} · الآية {pin.ayaNumber} · الصفحة {pin.pageNumber || "—"}
                    </div>
                    <div className="pin-banner__sub">حُفظ: {formattedDate}</div>
                </div>
            </div>
            <div className="pin-banner__actions">
                <button className="pin-jump-btn"  onClick={onJump}>← الرجوع إليها</button>
                <button className="pin-clear-btn" onClick={onClear}>حذف الـ Pin</button>
                <button className="pin-close-btn" onClick={onDismiss}>✕</button>
            </div>
        </div>
    );
};

export default PinBanner;
