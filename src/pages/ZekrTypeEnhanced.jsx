/**
 * ZekrTypeEnhanced — نسخة محسّنة من صفحة الأذكار مع نظام التتبع
 *
 * يوفر:
 * - تتبع تقدم قراءة الأذكار
 * - إشعارات ذكية
 * - عرض شريط التقدم والإحصائيات
 * - حفظ التقدم تلقائياً
 */

import { useEffect, useState, useCallback } from 'react';
import azkarData from '../data/adkar.json';
import AzkarBox from '../components/azkar/AzkarBox';
import RowZekr from '../components/azkar/RowZekr';
import AzkarTracker from '../components/AzkarTracker';
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';

const ZekrTypeEnhanced = ({ type }) => {
  const [azkar, setAzkar] = useState([]);
  const [azkarType, setAzkarType] = useState(null);

  // استخدام hooks التتبع والإشعارات
  const tracking = useAzkarTracking(azkarType);
  const notifications = useAzkarNotifications(true);

  // تحديد نوع الأذكار بناءً على الصفحة المفتوحة
  useEffect(() => {
    setAzkar(azkarData[type] || []);

    // تحديد النوع تلقائياً
    if (type.includes('الصباح')) {
      setAzkarType(AZKAR_TYPES.MORNING);
    } else if (type.includes('المساء')) {
      setAzkarType(AZKAR_TYPES.EVENING);
    }
  }, [type]);

  // معالج النقر على الذكر (تحديث التقدم)
  const handleZekrClick = useCallback((index) => {
    if (tracking.isItemRead(index)) {
      tracking.unmarkAsRead(index);
    } else {
      tracking.markAsRead(index);
    }
  }, [tracking]);

  // حساب الإحصائيات
  const stats = tracking.getStats(azkar.length);

  return (
    <div className="zekrType">
      <AzkarBox />
      
      {/* شريط التتبع */}
      <AzkarTracker
        stats={stats}
        period={tracking.currentPeriod}
        onNotificationToggle={notifications.toggleNotifications}
        notificationEnabled={notifications.notificationPermission}
      />

      {/* العنوان */}
      <div className="pageTitle">
        <h6>{type}</h6>
        {tracking.canTrack && (
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
            onClick={() => handleZekrClick(index)}
          >
            <RowZekr
              reference={zekr.reference}
              count={zekr.count}
              description={zekr.description}
              content={zekr.content}
              basmala={zekr.basmala}
              id={index}
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
    </div>
  );
};

export default ZekrTypeEnhanced;
