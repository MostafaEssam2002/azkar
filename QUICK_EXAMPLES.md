/**
 * QUICK_EXAMPLES.md
 * 
 * أمثلة سريعة وعملية للاستخدام الفوري
 * Copy & Paste جاهز!
 */

# 🚀 أمثلة استخدام سريعة

## مثال 1: استخدام بسيط جداً

### الملف: `src/pages/ZekrType.jsx` (التحديث البسيط)

```javascript
import { useEffect, useState, useCallback } from "react";
import azkarData from "../data/adkar.json";
import AzkarBox from './../components/azkar/AzkarBox';
import RowZekr from './../components/azkar/RowZekr';
import AzkarTracker from '../components/AzkarTracker';
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';

const ZekrType = ({ type }) => {
    const [azkar, setAzkar] = useState([]);
    const [azkarType, setAzkarType] = useState(null);
    
    // 👇 أضف هاتين السطرين فقط
    const tracking = useAzkarTracking(azkarType);
    const notifications = useAzkarNotifications(true);

    useEffect(() => {
        setAzkar(azkarData[type] || []);
        if (type.includes('الصباح')) setAzkarType(AZKAR_TYPES.MORNING);
        else if (type.includes('المساء')) setAzkarType(AZKAR_TYPES.EVENING);
    }, [type]);

    // 👇 معالج جديد لتتبع الأذكار
    const handleZekrClick = useCallback((index) => {
        if (tracking.isItemRead(index)) {
            tracking.unmarkAsRead(index);
        } else {
            tracking.markAsRead(index);
        }
    }, [tracking]);

    const stats = tracking.getStats(azkar.length);

    return (
        <>
            <div className="zekrType">
                <AzkarBox />
                
                {/* 👇 أضف شريط التقدم */}
                <AzkarTracker
                    stats={stats}
                    period={tracking.currentPeriod}
                    onNotificationToggle={notifications.toggleNotifications}
                    notificationEnabled={notifications.notificationPermission}
                />

                <div className="pageTitle">
                    <h6>{type}</h6>
                </div>

                {azkar.map((zekr, index) => (
                    <div 
                        key={`${type}-${index}`}
                        onClick={() => handleZekrClick(index)}  {/* 👈 أضف هذا */}
                        style={{ 
                            cursor: 'pointer', 
                            opacity: tracking.isItemRead(index) ? 0.5 : 1
                        }}
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
        </>
    )
}

export default ZekrType
```

---

## مثال 2: في مكون مخصص

### استخدام الـ Hooks مباشرة

```javascript
import { useEffect } from 'react';
import useAzkarTracking from '../hooks/useAzkarTracking';

const MyCustomComponent = () => {
  const tracking = useAzkarTracking('morning');

  // التحقق من قراءة عنصر معين
  useEffect(() => {
    if (tracking.isItemRead(0)) {
      console.log('تم قراءة الذكر الأول');
    }
  }, [tracking]);

  // الحصول على نسبة التقدم
  const stats = tracking.getStats(10);
  console.log(`النسبة المئوية: ${stats.percentage}%`);
  console.log(`المتبقي: ${stats.remaining}`);

  return (
    <div>
      <p>تقدمك: {stats.read} من {stats.total}</p>
      <button onClick={() => tracking.markAsRead(0)}>
        وضع علامة على الأول
      </button>
      <button onClick={() => tracking.resetProgress()}>
        إعادة تعيين
      </button>
    </div>
  );
};
```

---

## مثال 3: عرض المؤشر الصغير

### في الـ Header أو NavBar

```javascript
import AzkarProgressIndicator from '../components/AzkarProgressIndicator';
import { AZKAR_TYPES } from '../hooks/useAzkarTracking';

const Header = () => {
  return (
    <header>
      <h1>الموقع</h1>
      {/* 👇 يظهر فقط في أوقات الأذكار */}
      <AzkarProgressIndicator type={AZKAR_TYPES.MORNING} />
    </header>
  );
};
```

---

## مثال 4: الإشعارات فقط

### بدون الواجهة الرسومية

```javascript
import useAzkarNotifications from '../hooks/useAzkarNotifications';
import { AZKAR_TYPES } from '../hooks/useAzkarTracking';

const MyApp = () => {
  const { 
    notificationPermission, 
    toggleNotifications, 
    sendManualNotification 
  } = useAzkarNotifications(true);

  return (
    <div>
      <p>حالة الإشعارات: {notificationPermission ? '✅' : '❌'}</p>
      
      <button onClick={toggleNotifications}>
        {notificationPermission ? 'تعطيل' : 'تفعيل'} الإشعارات
      </button>

      <button onClick={() => sendManualNotification(AZKAR_TYPES.MORNING)}>
        إرسال إشعار صباح
      </button>

      <button onClick={() => sendManualNotification(AZKAR_TYPES.EVENING)}>
        إرسال إشعار مساء
      </button>
    </div>
  );
};
```

---

## مثال 5: عرض الإحصائيات الكاملة

```javascript
import { useEffect } from 'react';
import useAzkarTracking from '../hooks/useAzkarTracking';

const StatisticsPage = () => {
  const tracking = useAzkarTracking('morning');

  useEffect(() => {
    const stats = tracking.getStats(100);
    
    console.log('📊 الإحصائيات:');
    console.log(`المقروء: ${stats.read}`);
    console.log(`الكلي: ${stats.total}`);
    console.log(`النسبة: ${stats.percentage.toFixed(1)}%`);
    console.log(`المتبقي: ${stats.remaining}`);

    console.log('\n🕐 معلومات الفترة:');
    console.log(`النوع: ${tracking.currentPeriod.type}`);
    console.log(`نشط: ${tracking.currentPeriod.isActive}`);
    console.log(`الوقت المتبقي: ${tracking.currentPeriod.timeRemaining} دقيقة`);
  }, [tracking]);

  return (
    <div>
      <h2>الإحصائيات</h2>
      {/* عرض البيانات */}
    </div>
  );
};
```

---

## مثال 6: مع تأثيرات

```javascript
const AzkarWithEffects = ({ type }) => {
  const tracking = useAzkarTracking(type);
  const [readCount, setReadCount] = useState(0);

  // عرض رسالة عند قراءة ذكر
  const handleZekrClick = (index) => {
    if (!tracking.isItemRead(index)) {
      tracking.markAsRead(index);
      setReadCount(prev => prev + 1);
      
      // تأثير صوتي
      const audio = new Audio('/audio/ding.mp3');
      audio.play().catch(err => console.log('لا توجد أصوات'));
      
      // رسالة تحفيزية
      if (readCount % 5 === 4) {
        alert('ممتاز! لقد قرأت 5 أذكار! 🎉');
      }
    }
  };

  return (
    <div>
      {/* محتوى */}
    </div>
  );
};
```

---

## مثال 7: حفظ في Database (اختياري)

```javascript
const SyncWithDatabase = ({ userId }) => {
  const tracking = useAzkarTracking('morning');

  // مزامنة مع الخادم عند تحديث التقدم
  useEffect(() => {
    if (tracking.progress.readItems.length > 0) {
      // إرسال البيانات إلى الخادم
      fetch('/api/azkar-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'morning',
          progress: tracking.progress,
          timestamp: Date.now()
        })
      }).catch(err => console.error('خطأ في المزامنة:', err));
    }
  }, [tracking.progress, userId]);

  return <></>;
};
```

---

## مثال 8: اختبار في Console

```javascript
// انسخ وألصق في Console للاختبار الفوري

// 1. اختبر التخزين
console.log(localStorage.getItem('azkar_progress_morning'));

// 2. اختبر الإشعارات
console.log('إذن الإشعارات:', Notification.permission);

// 3. مسح البيانات
localStorage.removeItem('azkar_progress_morning');

// 4. عرض جميع مفاتيح الـ localStorage
Object.keys(localStorage)
  .filter(key => key.includes('azkar'))
  .forEach(key => {
    console.log(`${key}:`, localStorage.getItem(key));
  });
```

---

## الملفات المطلوبة للاستيراد

```javascript
// في أي صفحة تريد استخدام النظام
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';
import AzkarTracker from '../components/AzkarTracker';
import AzkarProgressIndicator from '../components/AzkarProgressIndicator';

// في ملف الأنماط الرئيسي
@import './components/_azkar-tracker.scss';
@import './components/_zekr-type-enhanced.scss';
```

---

## الثوابت المستخدمة

```javascript
// أنواع الأذكار
AZKAR_TYPES.MORNING   // أذكار الصباح
AZKAR_TYPES.EVENING   // أذكار المساء

// مفاتيح التخزين
'azkar_progress_morning'
'azkar_progress_evening'
```

---

## ✅ قائمة الفحص

- [ ] استيراد الـ Hooks
- [ ] استيراد المكونات
- [ ] استيراد الأنماط
- [ ] إضافة معالج النقر
- [ ] اختبار التقدم المحفوظ
- [ ] اختبار الإشعارات

---

**جاهز للاستخدام الآن!** 🚀
