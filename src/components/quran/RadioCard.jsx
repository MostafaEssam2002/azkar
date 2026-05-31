import Avatar from "./Avatar";
import WaveBars from "./WaveBars";

const RadioCard = ({ radio, isPlaying, onTogglePlay }) => (
  <div
    onClick={() => onTogglePlay(radio)}
    className={`radio-card${isPlaying ? " radio-card--playing" : ""}`}
  >
    <Avatar radio={radio} isPlaying={isPlaying} />

    <div className="radio-card__name">
      <div className="radio-card__name-text">{radio.name.trim()}</div>
      <div className="radio-card__subtitle">بث مباشر • HD</div>
    </div>

    <WaveBars count={6} active={isPlaying} />

    <div className="radio-card__play-btn">
      <svg viewBox="0 0 16 16" width="16" height="16" fill={isPlaying ? "#c9a84c" : "#2d6b45"}>
        {isPlaying ? (
          <>
            <rect x="3" y="2" width="3.5" height="12" rx="1.5" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1.5" />
          </>
        ) : (
          <path d="M4 2.5l9 5.5-9 5.5z" />
        )}
      </svg>
    </div>
  </div>
);

export default RadioCard;
