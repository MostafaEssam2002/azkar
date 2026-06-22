/**
 * useAzkarNotifications — نظام الإشعارات الذكية للأذكار
 *
 * يرسل إشعارات تذكيرية للمستخدم بناءً على الوقت الحالي:
 * - قبل الظهر: تذكير بأذكار الصباح
 * - بعد العصر: تذكير بأذكار المساء
 *
 * يخزن آخر إشعار مرسل لتجنب الإشعارات المكررة
 */

import { useEffect, useCallback, useContext, useRef, useState } from 'react';
// import { PrayerContext } from '../components/prayer/PrayerContext';
import { getNowMinutes, parseTime } from '../utils/utils';
import { AZKAR_TYPES, calculateCurrentAzkarPeriod } from './useAzkarTracking';
import { PrayerContext } from './../components/prayer/PrayerContext';

const NOTIFICATION_CONFIG = {
  [AZKAR_TYPES.MORNING]: {
    title: '🌅 تذكير أذكار الصباح',
    message: 'حان وقت أذكار الصباح! اقرأ الأذكار لتبدأ يومك بطاعة الله',
    icon: '🌅'
  },
  [AZKAR_TYPES.EVENING]: {
    title: '🌙 تذكير أذكار المساء',
    message: 'حان وقت أذكار المساء! قم بقراءة الأذكار قبل نهاية يومك',
    icon: '🌙'
  }
};

const LAST_NOTIFICATION_KEY = 'azkar_last_notification';

/**
 * طلب إذن الإشعارات من المتصفح
 */
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('المتصفح لا يدعم الإشعارات');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  // permission === 'default'
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/**
 * إرسال إشعار للمستخدم
 */
const sendNotification = (type) => {
  const config = NOTIFICATION_CONFIG[type];
  if (!config) return;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(config.title, {
      body: config.message,
      icon: '/images/azkar-icon.png', // يمكن تخصيص الأيقونة
      badge: '/images/azkar-badge.png',
      tag: `azkar_${type}`,
      requireInteraction: true // الإشعار يبقى حتى يتم التفاعل معه
    });
  }
};

export default function useAzkarNotifications(enabled = true) {
  const { prayerTimes } = useContext(PrayerContext) || {};
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (!('Notification' in window)) return false;
    return Notification.permission === 'granted';
  });

  const lastNotificationRef = useRef({
    type: null,
    timestamp: 0
  });

  // طلب إذن الإشعارات عند التحميل
  useEffect(() => {
    if (enabled && !notificationPermission) {
      requestNotificationPermission().then((hasPermission) => {
        setNotificationPermission(hasPermission);
      });
    }
  }, [enabled, notificationPermission]);

  // إرسال الإشعارات بناءً على الوقت
  useEffect(() => {
    if (!enabled || !notificationPermission) return;

    const checkAndNotify = () => {
      const period = calculateCurrentAzkarPeriod(prayerTimes);
      
      if (!period.isActive || !period.type) return;

      const now = Date.now();
      const lastNotif = lastNotificationRef.current;

      // تجنب الإشعارات المكررة في نفس الفترة (دقيقة واحدة على الأقل)
      const timeSinceLastNotif = now - lastNotif.timestamp;
      const MIN_INTERVAL = 60000; // دقيقة واحدة

      if (lastNotif.type === period.type && timeSinceLastNotif < MIN_INTERVAL) {
        return;
      }

      // إرسال الإشعار عند دخول الفترة الزمنية
      if (lastNotif.type !== period.type) {
        sendNotification(period.type);
        lastNotificationRef.current = {
          type: period.type,
          timestamp: now
        };
      }
    };

    // التحقق كل دقيقة
    const interval = setInterval(checkAndNotify, 60000);
    checkAndNotify(); // التحقق الأول فوراً

    return () => clearInterval(interval);
  }, [enabled, notificationPermission, prayerTimes]);

  /**
   * تفعيل/تعطيل الإشعارات يدوياً
   */
  const toggleNotifications = useCallback(async () => {
    if (!notificationPermission) {
      const hasPermission = await requestNotificationPermission();
      setNotificationPermission(hasPermission);
    } else {
      setNotificationPermission(false);
    }
  }, [notificationPermission]);

  /**
   * إرسال إشعار فوري (للاختبار أو التذكير اليدوي)
   */
  const sendManualNotification = useCallback((type) => {
    if (notificationPermission) {
      sendNotification(type);
    } else {
      console.log('الإشعارات غير مفعلة');
    }
  }, [notificationPermission]);

  return {
    notificationPermission,
    toggleNotifications,
    sendManualNotification
  };
}
