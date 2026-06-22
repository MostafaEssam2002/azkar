import { useSurahReading } from '../hooks/useSurahReading';
import FloatingPin from './../components/quran/FloatingPin';
import MiniPlayer from './../components/quran/MiniPlayer';
import PinToast from './../components/quran/PinToast';
import PinBanner from './../components/quran/PinBanner';
import SurahHero from './../components/quran/SurahHero';
import SuraSelector from './../components/quran/SuraSelector';
import QuranView from './../components/quran/QuranView';
import SurahNavigation from './../components/quran/SurahNavigation';

const SurahForReading = () => {
    const {
        chapter, verses, loading,
        currentSura, setCurrentSura,
        reciters, recitersLoading, selectedReciter, changeReciter,
        pin, clearPin, showBanner, setShowBanner,
        pinning, setPinning, handlePinDrop, jumpToPin,
        player, setPlayer,
        tooltip, setTooltip,
        toastVisible,
        readingAreaRef,
        goToPrevious, goToNext,
    } = useSurahReading();

    return (
        <div className="page">
            <FloatingPin onDropped={handlePinDrop} pinning={pinning} setPinning={setPinning} />
            {player && (
                <MiniPlayer
                    key={player.globalNumber}
                    src={player.src}
                    ayaText={player.ayaText}
                    ayaNumber={player.ayaNumber}
                    onClose={() => setPlayer(null)}
                    initialX={player.x}
                    initialY={player.y}
                />
            )}
            <PinToast visible={toastVisible} />
            <SurahHero
                chapter={chapter}
                reciters={reciters}
                selectedReciter={selectedReciter}
                onReciterChange={changeReciter}
                recitersLoading={recitersLoading}
            />
            <SuraSelector currentSura={currentSura} onChange={setCurrentSura} />
            {pin && showBanner && (
                <div className="pin-banner-wrapper">
                    <PinBanner
                        pin={pin}
                        onJump={jumpToPin}
                        onClear={() => { clearPin(); setShowBanner(false); }}
                        onDismiss={() => setShowBanner(false)}
                    />
                </div>
            )}
            <div ref={readingAreaRef}>
                <QuranView
                    verses={verses}
                    chapter={chapter}
                    currentSura={currentSura}
                    loading={loading}
                    tooltip={tooltip}
                    setTooltip={setTooltip}
                    player={player}
                    setPlayer={setPlayer}
                    pin={pin}
                    selectedReciter={selectedReciter}
                />
            </div>
            <SurahNavigation
                currentSura={currentSura}
                onPrevious={goToPrevious}
                onNext={goToNext}
            />
        </div>
    );
};

export default SurahForReading;