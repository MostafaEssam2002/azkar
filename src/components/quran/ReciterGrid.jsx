import ReciterCard from './ReciterCard';

const ReciterGrid = ({ reciters, onClearSearch }) => {
    if (reciters.length === 0) {
        return (
            <div className="no-results">
                <i className="fa-solid fa-circle-xmark no-results-icon"></i>
                <p>لم يتم العثور على قراء بهذا الاسم</p>
                <button className="no-results-btn" onClick={onClearSearch}>
                    عرض جميع القراء
                </button>
            </div>
        );
    }

    return (
        <div className="reciters-container">
            {reciters.map((reciter) => (
                <ReciterCard
                    key={reciter.id}
                    id={reciter.id}
                    name={reciter.name}
                    ar_name={reciter.recitation_type.ar_name}
                    rawi={reciter.rawi.name}
                    timing_url={reciter.timing_url}
                    server={reciter.server}
                    surahs_count={reciter.surahs_list?.length || 0}
                    surahs_list={reciter.surahs_list || []}
                />
            ))}
        </div>
    );
};

export default ReciterGrid;
