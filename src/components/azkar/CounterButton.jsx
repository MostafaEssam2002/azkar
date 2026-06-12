import { useContext, useEffect, useRef, useState } from "react";
import { PrayerContext } from "../PrayerContext";
import {
    AZKAR_TYPES,
    isAzkarPeriodActive,
    loadCounters,
    saveCounters,
    loadCategoryCounters,
    saveCategoryCounters,
} from "../../utils/azkarStorage";

const TRACKED_TYPES = [AZKAR_TYPES.MORNING, AZKAR_TYPES.EVENING];

const CounterButton = ({ num, id, categoryKey = 'default', onCountChange }) => {
    const targetNum = parseInt(num, 10) || 0;
    const prayerTimes = useContext(PrayerContext)?.prayerTimes || {};
    const isTrackedType = TRACKED_TYPES.includes(categoryKey);
    const periodActive = isTrackedType && isAzkarPeriodActive(categoryKey, prayerTimes);
    const wasPeriodActive = useRef(periodActive);

    const readCountFromStorage = () => {
        try {
            if (isTrackedType) {
                if (!periodActive) return targetNum;

                const countersData = loadCounters(categoryKey, prayerTimes);
                if (countersData && countersData[id] !== undefined) {
                    return parseInt(countersData[id], 10);
                }
                return targetNum;
            }

            const countersData = loadCategoryCounters(categoryKey);
            return countersData && countersData[id] !== undefined
                ? parseInt(countersData[id], 10)
                : targetNum;
        } catch (error) {
            console.error('Error loading counter:', error);
            return targetNum;
        }
    };

    const [count, setCount] = useState(readCountFromStorage);

    useEffect(() => {
        setCount(readCountFromStorage());
    }, [targetNum, id, categoryKey, periodActive]);

    useEffect(() => {
        if (periodActive && !wasPeriodActive.current) {
            setCount(readCountFromStorage());
        }
        wasPeriodActive.current = periodActive;
    }, [periodActive, categoryKey, id, targetNum]);

    useEffect(() => {
        const handleStorageCleared = (event) => {
            if (event.detail?.type === categoryKey) {
                setCount(targetNum);
            }
        };

        window.addEventListener('azkar-storage-cleared', handleStorageCleared);
        return () => window.removeEventListener('azkar-storage-cleared', handleStorageCleared);
    }, [categoryKey, targetNum]);

    useEffect(() => {
        if (isTrackedType && !periodActive) return;

        try {
            if (isTrackedType) {
                const countersData = loadCounters(categoryKey, prayerTimes) || {};
                countersData[id] = count;
                saveCounters(categoryKey, countersData, prayerTimes);
                return;
            }

            const countersData = loadCategoryCounters(categoryKey) || {};
            countersData[id] = count;
            saveCategoryCounters(categoryKey, countersData);
        } catch (error) {
            console.error('Error saving counter:', error);
        }
    }, [count, id, categoryKey, prayerTimes, isTrackedType, periodActive]);

    useEffect(() => {
        onCountChange?.(count);
    }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCount = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const resetCounter = (e) => {
        e.stopPropagation();
        setCount(targetNum);

        if (isTrackedType && !periodActive) return;

        try {
            if (isTrackedType) {
                const countersData = loadCounters(categoryKey, prayerTimes) || {};
                countersData[id] = targetNum;
                saveCounters(categoryKey, countersData, prayerTimes);
                return;
            }

            const countersData = loadCategoryCounters(categoryKey) || {};
            countersData[id] = targetNum;
            saveCategoryCounters(categoryKey, countersData);
        } catch (error) {
            console.error('Error resetting counter in storage:', error);
        }
    };

    return (
        <div
            className={
                count < targetNum
                    ? "counterSectionDecremented"
                    : "counterSection"
            }
            onClick={handleCount}
        >
            <div className="counterNumberWrapper">
                <button type="button" className="counterSectionButton">
                    {count}
                </button>

                <span className="counterShadow">
                    {targetNum}
                </span>
            </div>

            <div className="counterFooter">
                <span
                    className="counterSectionReset"
                    onClick={resetCounter}
                >
                    ↺
                </span>
                <span className="counterId">
                    {id}
                </span>
            </div>
        </div>
    );
};

export default CounterButton;
