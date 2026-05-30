import { useState, useCallback } from "react";

const PIN_KEY = "quran_pin";

const usePin = () => {
    const [pin, setPin] = useState(() => {
        try { return JSON.parse(localStorage.getItem(PIN_KEY)) || null; }
        catch { return null; }
    });

    const savePin = useCallback((data) => {
        const entry = { ...data, savedAt: new Date().toISOString() };
        localStorage.setItem(PIN_KEY, JSON.stringify(entry));
        setPin(entry);
    }, []);

    const clearPin = useCallback(() => {
        localStorage.removeItem(PIN_KEY);
        setPin(null);
    }, []);

    return { pin, savePin, clearPin };
};

export default usePin;
