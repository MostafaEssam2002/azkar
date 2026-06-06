import { useState, useCallback } from "react";

const usePin = (key = "quran_pin") => {
    const [pin, setPin] = useState(() => {
        try { return JSON.parse(localStorage.getItem(key)) || null; }
        catch { return null; }
    });

    const savePin = useCallback((data) => {
        const entry = { ...data, savedAt: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify(entry));
        setPin(entry);
    }, [key]);

    const clearPin = useCallback(() => {
        localStorage.removeItem(key);
        setPin(null);
    }, [key]);

    return { pin, savePin, clearPin };
};

export default usePin;
