import LoadingState from '../components/quran/LoadingState';
import ErrorState from '../components/quran/ErrorState';
import ReciterGrid from '../components/quran/ReciterGrid';
import Pagination from '../components/quran/Pagination';
import useReciterSearch from './../hooks/useReciterSearch';
import useReciters from './../hooks/useReciters';
import SearchBar from './../components/quran/SearchBar';

const QuranPage = () => {
    const { reciters, loading, error, handleRetry } = useReciters();

    const {
        searchQuery,
        filteredReciters,
        currentReciters,
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        pageNumbers,
        handleSearchChange,
        handleClearSearch,
        handlePrevPage,
        handleNextPage,
        handlePageClick,
    } = useReciterSearch(reciters);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState onRetry={handleRetry} />;

    return (
        <div className="quranPage" dir="rtl">
            <SearchBar
                searchQuery={searchQuery}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                resultsCount={filteredReciters.length}
            />

            <ReciterGrid
                reciters={currentReciters}
                onClearSearch={handleClearSearch}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                startIndex={startIndex}
                endIndex={endIndex}
                totalCount={filteredReciters.length}
                searchQuery={searchQuery}
                allRecitersCount={reciters.length}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                onPageClick={handlePageClick}
            />
        </div>
    );
};

export default QuranPage;