const WaveBars = ({ count = 4, active }) => {
  const baseHeights = [8, 14, 10, 18, 12, 16, 9];
  return (
    <div className="wave-bars">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`wave-bars__bar${active ? " wave-bars__bar--active" : ""}`}
          style={{ height: baseHeights[i % baseHeights.length] }}
        />
      ))}
    </div>
  );
};

export default WaveBars;
