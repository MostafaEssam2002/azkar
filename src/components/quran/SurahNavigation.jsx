const SurahNavigation = ({ currentSura, onPrevious, onNext }) => {
    return (
        <div className="surah-navigation">
            <button
                className="nav-button prev-button"
                onClick={onPrevious}
                disabled={currentSura === 1}
                title="السورة السابقة"
            >
                <span className="arrow">→</span>
                <span className="text">السورة السابقة</span>
            </button>

            <div className="surah-counter">
                <span className="current">{currentSura}</span>
                <span className="separator">/</span>
                <span className="total">114</span>
            </div>

            <button
                className="nav-button next-button"
                onClick={onNext}
                disabled={currentSura === 114}
                title="السورة التالية"
            >
                <span className="text">السورة التالية</span>
                <span className="arrow">←</span>
            </button>
        </div>
    );
};

export default SurahNavigation;
