const QuranHeader = ({ chapter }) => (
    <div className="header">
        <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <h2 className="title">{chapter?.name_arabic || ""}</h2>
        <div className="divider_surah" />
        {chapter && (
            <div className="meta">
                <span className="meta-badge">
                    {chapter.revelation_place === "makkah" ? "مكية" : "مدنية"}
                </span>
                <span className="meta-badge">{chapter.verses_count} آية</span>
                <span className="meta-badge">ترتيب النزول: {chapter.revelation_order}</span>
            </div>
        )}
    </div>
);

export default QuranHeader;
