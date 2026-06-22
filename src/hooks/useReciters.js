import { useEffect, useRef, useState } from 'react';
import getData from '../api/getData';
import localReciters from '../data/reciters.json';
import { API_CONFIG } from '../config/api';

const filterBySurahClassification = (data) => {
    const flattened = (Array.isArray(data) ? data : []).flat();
    return flattened.filter(
        (reciter) => reciter?.classification?.name === "حسب السور"
    );
};

const useReciters = () => {
    const ref = useRef(false);
    const [reciters, setReciters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [usingFallback, setUsingFallback] = useState(false);

    const loadReciters = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await getData(API_CONFIG.recitersApi);
            const filteredData = filterBySurahClassification(res);
            setReciters(filteredData);
            setUsingFallback(false);
        } catch (err) {
            const fallbackData = filterBySurahClassification(localReciters);
            if (fallbackData.length > 0) {
                setReciters(fallbackData);
                setUsingFallback(true);
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        ref.current = false;
        loadReciters();
    };

    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        loadReciters();
    }, []);

    return { reciters, loading, error, usingFallback, handleRetry };
};

export default useReciters;
