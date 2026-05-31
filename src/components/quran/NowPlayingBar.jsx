const NowPlayingBar = ({ radio, onStop }) => (
  <div className="radio-app__now-playing">
    <div className="radio-app__now-playing-dot" />
    <span className="radio-app__now-playing-label">يُبث الآن</span>
    <span className="radio-app__now-playing-name">{radio.name.trim()}</span>
    <button className="radio-app__stop-btn" onClick={onStop}>■</button>
  </div>
);

export default NowPlayingBar;
