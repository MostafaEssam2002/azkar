import azkarData from "../data/adkar.json";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import AzkarBox from './../components/azkar/AzkarBox';
import RowZekr from './../components/azkar/RowZekr';
import AzkarTracker from '../components/azkar/AzkarTracker';import AzkarCompletion from '../components/azkar/AzkarCompletion';import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';

const ZekrType = ({ type }) => {
    const [azkar, setAzkar] = useState([]);
    const [searchParams] = useSearchParams();

    // تحديد نوع الأذكار مباشرة بدون useState لتجنب التأخير
    const azkarType = useMemo(() => {
        if (type.includes('الصباح')) {
            return AZKAR_TYPES.MORNING;
        } else if (type.includes('المساء')) {
            return AZKAR_TYPES.EVENING;
        }
        return null;
    }, [type]);

    const categoryKey = azkarType || type;

    // استخدام hooks التتبع والإشعارات
    const tracking = useAzkarTracking(azkarType);
    const notifications = useAzkarNotifications(true);

    useEffect(() => {
        setAzkar(azkarData[type] || []);
    }, [type]);

    useEffect(() => {
        const scrollToValue = Number(searchParams.get("scrollTo"));
        if (!Number.isFinite(scrollToValue) || scrollToValue < 1 || azkar.length === 0) {
            return;
        }

        const itemIndex = Math.min(scrollToValue, azkar.length) - 1;
        const target = document.querySelector(`[data-zekr-index="${itemIndex + 1}"]`);

        if (!target) {
            return;
        }

        const scrollToItem = () => {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        };

        requestAnimationFrame(scrollToItem);
    }, [searchParams, azkar.length, type]);

  // تحديث التقدم عند وصول العداد إلى صفر
    const handleCounterChange = useCallback((index, currentCount) => {
        if (currentCount === 0) {
            tracking.markAsRead(index);
        } else {
            tracking.unmarkAsRead(index);
        }
    }, [tracking]);

    // حساب الإحصائيات
    const stats = tracking.getStats(azkar.length);
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {
        if (stats.total > 0 && stats.read === stats.total) {
            setShowCompletion(true);
            const timer = setTimeout(() => setShowCompletion(false), 5000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [stats.read, stats.total]);

    return (
        <>
            <div className="zekrType">
                <AzkarBox />

                {/* شريط التتبع */}
                {azkarType && (
                    <AzkarTracker
                        stats={stats}
                        period={tracking.currentPeriod}
                        azkarType={azkarType}
                        canTrack={tracking.canTrack}
                        onNotificationToggle={notifications.toggleNotifications}
                        notificationEnabled={notifications.notificationPermission}
                    />
                )}

                <div className="pageTitle">
                    <h6>{type}</h6>
                    {azkarType && (
                        <p className="tracking-info">
                            تقدمك: {stats.read} من {stats.total}
                        </p>
                    )}
                </div>

                {/* قائمة الأذكار */}
                <div className="azkar-list">
                    {azkar.map((zekr, index) => (
                        <div
                            key={`${type}-${index}`}
                            data-zekr-index={index + 1}
                            className={`zekr-item-wrapper ${tracking.isItemRead(index) ? 'read' : ''}`}
                        >
                            <RowZekr 
                                reference={zekr.reference} 
                                count={zekr.count} 
                                description={zekr.description} 
                                content={zekr.content} 
                                basmala={zekr.basmala} 
                                id={index}
                                categoryKey={categoryKey}
                                onCountChange={(currentCount) => handleCounterChange(index, currentCount)}
                            />
                        </div>
                    ))}
                </div>

                {/* رسالة نهاية القائمة */}
                {stats.read === stats.total && stats.total > 0 && (
                    <div className="completion-message">
                        <h3>🎉 ممتاز!</h3>
                        <p>لقد قرأت جميع الأذكار. جزاك الله خيراً!</p>
                        <button
                            className="reset-button"
                            onClick={() => tracking.resetProgress()}
                        >
                            إعادة تعيين التقدم
                        </button>
                    </div>
                )}

                <AzkarCompletion active={showCompletion} />
            </div>
        </>
    )
}

export default ZekrType