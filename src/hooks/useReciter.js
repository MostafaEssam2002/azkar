import { useState, useEffect, useCallback } from "react";
import { API_CONFIG } from "../config/api";

const RECITER_STORAGE_KEY = "selectedReciterIdentifier";
const DEFAULT_RECITER = "husary";

const useReciter = () => {
    const [reciters, setReciters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReciter, setSelectedReciter] = useState(
        () => localStorage.getItem(RECITER_STORAGE_KEY) || DEFAULT_RECITER
    );

    useEffect(() => {
        let isMounted = true;
        fetch(API_CONFIG.alfurqan + "/reciters")
            .then((r) => r.json())
            .then((data) => {
                if (!isMounted) return;
                if (Array.isArray(data.reciters)) {
                    setReciters(data.reciters);
                }
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err);
                setLoading(false);
            });
        return () => { isMounted = false; };
    }, []);

    const changeReciter = useCallback((id) => {
        setSelectedReciter(id);
        localStorage.setItem(RECITER_STORAGE_KEY, id);
    }, []);

    return { reciters, loading, error, selectedReciter, changeReciter };
};

export default useReciter;