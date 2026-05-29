import { useEffect, useRef, useState, useMemo } from 'react';
import ReciterCard from '../components/quran/ReciterCard';
import getData from './../api/getData';
const QuranPage = () => {
    const ref = useRef(false);
    const [reciters, setReciters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 6;
    useEffect(() => {
        async function fetchReciters() {
            if (ref.current) return;
            ref.current = true;
            try {
                setLoading(true);
                const res = await getData("/api/reciters");
                const flattenedData = res.flat();
                const filteredData = flattenedData.filter(
                    (reciter) =>
                        reciter.classification.name === "حسب السور"
                );
                setReciters(filteredData);
            } catch (error) {
                console.error("Error fetching reciters:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReciters();
    }, []);
    // فلترة القراء بناءً على نص البحث

    const filteredReciters = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) return reciters;
        return reciters.filter((reciter) =>
            reciter.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [reciters, searchQuery]);
    // حساب البيانات المعروضة في الصفحة الحالية
    const totalPages = Math.ceil(filteredReciters.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReciters = filteredReciters.slice(startIndex, endIndex);

    // دالة ذكية لحساب أرقام الصفحات مع الـ ellipsis
    const getPageNumbers = (current, total) => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        if (current <= 4) {
            return [1, 2, 3, 4, 5, '...', total];
        }
        if (current >= total - 3) {
            return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        }
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    // عند البحث نرجع للصفحة الأولى
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    // التعامل مع تغيير الصفحة
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageClick = (page) => {
        if (page === '...') return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="quranPage" dir="rtl">

            {/* Spinner */}
            {loading ? (
                <div className="spinnerContainer">
                    <div className="spinner"></div>
                    <p>جارٍ التحميل...</p>
                </div>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="search-wrapper">
                        <div className="search-box">
                            <i className="fa-solid fa-magnifying-glass search-icon"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="ابحث عن قارئ..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && (
                                <button className="search-clear-btn" onClick={handleClearSearch}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>

                        {/* نتائج البحث */}
                        {searchQuery && (
                            <p className="search-results-text">
                                {filteredReciters.length > 0
                                    ? `تم العثور على ${filteredReciters.length} نتيجة لـ "${searchQuery}"`
                                    : `لا توجد نتائج لـ "${searchQuery}"`
                                }
                            </p>
                        )}
                    </div>

                    {/* قائمة القراء */}
                    {currentReciters.length > 0 ? (
                        <div className="reciters-container">
                            {currentReciters.map((reciter) => (
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
                    ) : (
                        <div className="no-results">
                            <i className="fa-solid fa-circle-xmark no-results-icon"></i>
                            <p>لم يتم العثور على قراء بهذا الاسم</p>
                            <button className="no-results-btn" onClick={handleClearSearch}>
                                عرض جميع القراء
                            </button>
                        </div>
                    )}

                    {/* Pagination — تظهر فقط لو مفيش بحث أو النتائج أكتر من صفحة */}
                    {totalPages > 1 && (
                        <div className="pagination">

                            {/* زر السابق */}
                            <button
                                className="pagination-btn prev-btn"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                                السابق
                            </button>

                            {/* أرقام الصفحات */}
                            <div className="pagination-pages">
                                {getPageNumbers(currentPage, totalPages).map((page, index) => (
                                    <button
                                        key={index}
                                        className={`page-number ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                        onClick={() => handlePageClick(page)}
                                        disabled={page === '...'}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            {/* زر التالي */}
                            <button
                                className="pagination-btn next-btn"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                التالي
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                        </div>
                    )}

                    {/* معلومات الصفحة */}
                    {filteredReciters.length > 0 && (
                        <div className="pagination-info">
                            عرض {startIndex + 1} إلى {Math.min(endIndex, filteredReciters.length)} من {filteredReciters.length} قارئ
                            {searchQuery && ` (من أصل ${reciters.length})`}
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default QuranPage;