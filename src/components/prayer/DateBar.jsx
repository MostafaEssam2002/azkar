export default function DateBar({ gregDate, hijriDate }) {
    return (
        <div className="date-bar">
        <span>{gregDate}</span>
        <span className="date-bar__hijri">{hijriDate}</span>
        </div>
    );
}
