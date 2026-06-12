import azkarData from "../data/adkar.json";
import { useEffect, useState, useCallback, useMemo } from "react";
import AzkarBox from './../components/azkar/AzkarBox';
import RowZekr from './../components/azkar/RowZekr';
import AzkarTracker from '../components/AzkarTracker';
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';

const ZekrType = ({ type }) => {
    const [azkar, setAzkar] = useState([]);

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
                            {/* شارة التقدم — تظهر عند اكتمال العداد */}
                            <div className="read-indicator">
                                {tracking.isItemRead(index) && (
                                    <span className="checkmark">✓</span>
                                )}
                            </div>
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
            </div>
        </>
    )
}

export default ZekrType