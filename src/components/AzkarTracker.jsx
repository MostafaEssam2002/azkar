/**
 * AzkarTracker — مكون لعرض شريط التقدم والإحصائيات
 *
 * يعرض تقدم نوع الأذكار الخاص بالصفحة الحالية (صباح/مساء)
 * وليس فقط الفترة الزمنية النشطة حسب وقت الصلاة
 */

import { useEffect, useState } from 'react';
import { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import '../styles/components/_azkar-tracker.scss';

const formatTimeRemaining = (minutes) => {
  if (minutes <= 0) return 'انتهت الفترة';

  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours === 0) {
    return `${mins} دقيقة متبقية`;
  }
  return `${hours} ساعة و ${mins} دقيقة متبقية`;
};

const PERIOD_LABELS = {
  [AZKAR_TYPES.MORNING]: '🌅 أذكار الصباح',
  [AZKAR_TYPES.EVENING]: '🌙 أذكار المساء',
};

export default function AzkarTracker({
  stats = { read: 0, total: 0, percentage: 0, remaining: 0 },
  period = { type: null, isActive: false, timeRemaining: 0 },
  azkarType = null,
  canTrack = false,
  onNotificationToggle = null,
  notificationEnabled = false,
}) {
  const [displayTime, setDisplayTime] = useState(() =>
    formatTimeRemaining(period.timeRemaining)
  );

  useEffect(() => {
    setDisplayTime(formatTimeRemaining(period.timeRemaining));
  }, [period.timeRemaining]);

  useEffect(() => {
    if (!canTrack) return;

    const interval = setInterval(() => {
      setDisplayTime(formatTimeRemaining(period.timeRemaining));
    }, 60000);

    return () => clearInterval(interval);
  }, [canTrack, period.timeRemaining]);

  if (!azkarType) {
    return null;
  }

  const periodLabel = PERIOD_LABELS[azkarType] || 'أذكار';

  return (
    <div className={`azkar-tracker ${canTrack ? 'active' : 'inactive'}`}>
      <div className="tracker-header">
        <div className="period-info">
          <span className="period-label">{periodLabel}</span>
          {canTrack ? (
            <span className="time-remaining">{displayTime}</span>
          ) : (
            <span className="time-remaining">⏰ ليس وقت هذه الأذكار حالياً</span>
          )}
        </div>
        {canTrack && onNotificationToggle && (
          <button
            type="button"
            className={`notification-toggle ${notificationEnabled ? 'enabled' : 'disabled'}`}
            onClick={onNotificationToggle}
            title={notificationEnabled ? 'تعطيل الإشعارات' : 'تفعيل الإشعارات'}
          >
            {notificationEnabled ? '🔔' : '🔕'}
          </button>
        )}
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(stats.percentage, 100)}%` }}
        >
          {stats.percentage > 10 && (
            <span className="progress-percentage">{Math.round(stats.percentage)}%</span>
          )}
        </div>
      </div>

      <div className="tracker-stats">
        <div className="stat">
          <span className="stat-label">المقروء</span>
          <span className="stat-value">{stats.read}</span>
        </div>
        <div className="stat">
          <span className="stat-label">الكلي</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">المتبقي</span>
          <span className="stat-value">{stats.remaining}</span>
        </div>
      </div>
    </div>
  );
}
