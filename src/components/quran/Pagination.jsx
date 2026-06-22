const Pagination = ({
    currentPage,
    totalPages,
    pageNumbers,
    startIndex,
    endIndex,
    totalCount,
    searchQuery,
    allRecitersCount,
    onPrev,
    onNext,
    onPageClick,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <div className="pagination-controls">
                <button
                    className="pagination-btn prev-btn"
                    onClick={onPrev}
                    disabled={currentPage === 1}
                >
                    <i className="fa-solid fa-chevron-right"></i>
                    السابق
                </button>

                <div className="pagination-pages">
                    {pageNumbers.map((page, index) => (
                        <button
                            key={index}
                            className={`page-number ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                            onClick={() => onPageClick(page)}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="pagination-btn next-btn"
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                >
                    التالي
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
            </div>

            {totalCount > 0 && (
                <div className="pagination-info">
                    عرض {startIndex + 1} إلى {Math.min(endIndex, totalCount)} من {totalCount} قارئ
                    {searchQuery && ` (من أصل ${allRecitersCount})`}
                </div>
            )}
        </div>
    );
};

export default Pagination;
