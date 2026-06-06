import React, { useState, useEffect } from "react";
// import "./completion-popup.scss";

const CompletionPopup = ({ visible, onClose }) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (visible) {
            setIsShowing(true);
        }
    }, [visible]);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    if (!isShowing && !visible) return null;

    return (
        <div className={`completion-popup ${visible && isShowing ? "active" : ""}`}>
            <div className="completion-popup__overlay" onClick={handleClose} />
            <div className="completion-popup__content">
                <div className="completion-popup__icon">
                    ✨
                </div>
                <h1 className="completion-popup__title">
                    مبروووك! 🎉
                </h1>
                <p className="completion-popup__subtitle">
                    لقد أكملت قراءة القرآن الكريم
                </p>
                <p className="completion-popup__message">
                    جزاك الله خيراً على مواظبتك على قراءة كتاب الله
                </p>
                <div className="completion-popup__actions">
                    <button 
                        className="completion-popup__button"
                        onClick={handleClose}
                    >
                        الاستمرار
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompletionPopup;
