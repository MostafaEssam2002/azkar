import { useMemo, useState } from 'react';

const useReciterSearch = (reciters, itemsPerPage = 6) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredReciters = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) return reciters;
        return reciters.filter((reciter) =>
            reciter.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [reciters, searchQuery]);

    const totalPages = Math.ceil(filteredReciters.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReciters = filteredReciters.slice(startIndex, endIndex);

    const getPageNumbers = (current, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((p) => p - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((p) => p + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageClick = (page) => {
        if (page === '...') return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        searchQuery,
        filteredReciters,
        currentReciters,
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        pageNumbers: getPageNumbers(currentPage, totalPages),
        handleSearchChange,
        handleClearSearch,
        handlePrevPage,
        handleNextPage,
        handlePageClick,
    };
};

export default useReciterSearch;
