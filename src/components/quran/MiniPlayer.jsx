import useAudioPlayer from "../../hooks/useAudioPlayer";
import useDraggable    from "../../hooks/useDraggable";
import { BAR_HEIGHTS } from "../../utils/quranHelpers";

const MiniPlayer = ({ src, ayaText, ayaNumber, onClose, initialX, initialY }) => {
    const { audioRef, playing, progress, currentTime, duration, volume, toggle, skip, seek, changeVolume } =
        useAudioPlayer(src, onClose);

    const { pos, setPos, isDragging, startDrag } = useDraggable({ x: initialX, y: initialY });

    const activeCount = Math.floor((progress / 100) * BAR_HEIGHTS.length);
    const PW    = Math.min(320, window.innerWidth - 16);
    const safeX = Math.max(8, Math.min(window.innerWidth  - PW  - 8, pos.x));
    const safeY = Math.max(8, Math.min(window.innerHeight - 170 - 8, pos.y));

    return (
        <div
            className={`mini-player ${isDragging ? "mini-player--dragging" : "mini-player--idle"}`}
            style={{ left: safeX, top: safeY, width: PW }}
            onMouseDown={(e) => { startDrag(e.clientX, e.clientY); e.preventDefault(); }}
            onTouchStart={(e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
        >
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Header */}
            <div className="mini-player__header">
                <span className="mini-player__drag-dots">⠿</span>
                <span className="mini-player__aya-label">﴿{ayaNumber}﴾</span>
                <span className="mini-player__aya-text">{ayaText}</span>
                <button
                    className="mini-player__close-btn"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={onClose}
                >✕</button>
            </div>

            {/* Waveform */}
            <div className="mini-player__wave-row" onMouseDown={(e) => e.stopPropagation()}>
                <span className="mini-player__timestamp">{currentTime}</span>
                <div className="mini-player__waveform">
                    {BAR_HEIGHTS.map((h, i) => (
                        <div
                            key={i}
                            className="mini-player__bar"
                            style={{
                                height: `${h}px`,
                                background: i < activeCount
                                    ? "#c9a84c"
                                    : playing
                                        ? `rgba(201,168,76,${0.2 + Math.abs(Math.sin(i * 0.4)) * 0.18})`
                                        : "rgba(201,168,76,0.18)",
                                animation: playing && i >= activeCount
                                    ? `mpwave ${0.5 + (i % 5) * 0.1}s ease-in-out infinite alternate`
                                    : "none",
                            }}
                        />
                    ))}
                </div>
                <span className="mini-player__timestamp">{duration}</span>
            </div>

            {/* Progress bar */}
            <div
                className="mini-player__progress-bg"
                onClick={seek}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="mini-player__progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Controls */}
            <div className="mini-player__bottom-row" onMouseDown={(e) => e.stopPropagation()}>
                <div className="mini-player__vol-group">
                    <button className="mini-player__small-btn" onClick={() => changeVolume(+(volume - 0.15).toFixed(2))}>−</button>
                    <div className="mini-player__vol-track" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        changeVolume((e.clientX - rect.left) / rect.width);
                    }}>
                        <div className="mini-player__vol-fill" style={{ width: `${volume * 100}%` }} />
                    </div>
                    <button className="mini-player__small-btn" onClick={() => changeVolume(+(volume + 0.15).toFixed(2))}>+</button>
                </div>
                <div className="mini-player__ctrl-group">
                    <button className="mini-player__skip-btn" onClick={() => skip(-5)}>⏮5</button>
                    <button className="mini-player__play-btn" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
                    <button className="mini-player__skip-btn" onClick={() => skip(5)}>5⏭</button>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;
