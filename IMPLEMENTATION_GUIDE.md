/**
 * IMPLEMENTATION_GUIDE.md
 * 
 * دليل التطبيق العملي - نظام تتبع الأذكار
 * 
 * هذا الملف يحتوي على أمثلة عملية سريعة للتكامل
 */

# 🚀 دليل التطبيق السريع

## الطريقة الأسرع للتكامل (5 دقائق)

### الخطوة 1: استخدم الصفحة المحسّنة الجاهزة

```javascript
// في ملف الـ Router الخاص بك
import ZekrTypeEnhanced from './pages/ZekrTypeEnhanced';

// أضف هذا المسار:
{
  path: '/azkar/:type',
  element: <ZekrTypeEnhanced type={params.type} />
}
```

**خلاص! انتهينا!** 🎉

---

## إذا كنت تريد تحديث الصفحة الموجودة

### الخطوة 1: افتح `src/pages/ZekrType.jsx`

### الخطوة 2: استبدل المحتوى بهذا:

```javascript
import { useEffect, useState, useCallback } from 'react';
import azkarData from '../data/adkar.json';
import AzkarBox from '../components/azkar/AzkarBox';
import RowZekr from '../components/azkar/RowZekr';
import AzkarTracker from '../components/AzkarTracker';
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';

const ZekrType = ({ type }) => {
  const [azkar, setAzkar] = useState([]);
  const [azkarType, setAzkarType] = useState(null);

  // ✅ أضف هذه الـ Hooks
  const tracking = useAzkarTracking(azkarType);
  const notifications = useAzkarNotifications(true);

  useEffect(() => {
    setAzkar(azkarData[type] || []);
    
    // ✅ حدد نوع الأذكار تلقائياً
    if (type.includes('الصباح')) {
      setAzkarType(AZKAR_TYPES.MORNING);
    } else if (type.includes('المساء')) {
      setAzkarType(AZKAR_TYPES.EVENING);
    }
  }, [type]);

  // ✅ معالج النقر على الذكر
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
        
        {/* ✅ أضف شريط التتبع */}
        <AzkarTracker
          stats={stats}
          period={tracking.currentPeriod}
          onNotificationToggle={notifications.toggleNotifications}
          notificationEnabled={notifications.notificationPermission}
        />

        <div className="pageTitle">
          <h6>{type}</h6>
        </div>

        {/* ✅ أضف الفئة والمعالج */}
        {azkar.map((zekr, index) => (
          <div
            key={`${type}-${index}`}
            className={tracking.isItemRead(index) ? 'read' : ''}
            onClick={() => handleZekrClick(index)}
            style={{ cursor: 'pointer', opacity: tracking.isItemRead(index) ? 0.6 : 1 }}
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
  );
};

export default ZekrType;
```

### الخطوة 3: استيراد الأنماط

في `src/styles/main.scss`:

```scss
@import './components/_azkar-tracker.scss';
@import './components/_zekr-type-enhanced.scss';
```

**خلاص! تم!** ✅

---

## اختبر التطبيق

### 1. اختبر التتبع

```javascript
// افتح Console في المتصفح
localStorage.getItem('azkar_progress_morning')
// يجب أن يظهر شيء مثل:
// {"readItems":[0,1,2],"startedAt":1719341400000,...}
```

### 2. اختبر الإشعارات

```javascript
// اضغط على زر الجرس في شريط التتبع
// يجب أن تظهر إشعارات
```

### 3. اختبر في أوقات مختلفة

- **صباحاً (بين الفجر والظهر)**: يجب أن تظهر "أذكار الصباح"
- **مساءً (بعد العصر)**: يجب أن تظهر "أذكار المساء"

---

## الميزات المضافة

✅ **تتبع تلقائي للتقدم**
- علامة ✓ على الأذكار المقروءة
- شريط تقدم ديناميكي
- إحصائيات فورية

✅ **إشعارات ذكية**
- 🔔 إشعارات في الوقت المناسب
- 🔕 يمكن التحكم فيها بسهولة
- لا تكرار مزعج

✅ **حفظ ذكي**
- حفظ تلقائي في localStorage
- استمرار من حيث توقفت
- حذف تلقائي بعد انتهاء الفترة

---

## الملفات الرئيسية

```
✅ src/hooks/useAzkarTracking.js
✅ src/hooks/useAzkarNotifications.js
✅ src/components/AzkarTracker.jsx
✅ src/pages/ZekrTypeEnhanced.jsx (اختياري)
✅ src/styles/components/_azkar-tracker.scss
✅ src/styles/components/_zekr-type-enhanced.scss
```

---

## أسئلة شائعة

### Q: هل تتأثر الأذكار الأخرى؟
**A:** لا! النظام مستقل تماماً ويعمل بجانب الأذكار الموجودة.

### Q: هل يمكن استخدام النظام مع أذكار أخرى؟
**A:** نعم! يمكنك تطبيقه على أي نوع ذكر:
```javascript
const tracking = useAzkarTracking('any_type');
```

### Q: هل البيانات آمنة؟
**A:** تماماً! تُحفظ محلياً فقط ولا تُرسل لأي خادم.

### Q: ماذا لو أعجبني الشكل الحالي؟
**A:** يمكنك فقط استخدام `useAzkarTracking` بدون المكون الرسومي:
```javascript
const tracking = useAzkarTracking(azkarType);
// استخدم التقدم كما تريد
```

---

## نصائح إضافية

### 1. تخصيص الألوان

في `_azkar-tracker.scss`:

```scss
.azkar-tracker.active {
  background: linear-gradient(135deg, #your_color1 0%, #your_color2 100%);
}
```

### 2. تغيير رسالة الإشعار

في `useAzkarNotifications.js`:

```javascript
const NOTIFICATION_CONFIG = {
  morning: {
    title: 'رسالتك الخاصة هنا',
    message: 'الرسالة التي تريدها'
  }
};
```

### 3. إضافة صوت للإشعارات

```javascript
const sendNotification = (type) => {
  // ... الكود الموجود
  const audio = new Audio('/audio/notification.mp3');
  audio.play();
};
```

---

## تحقق من التثبيت

```bash
# في المتصفح, افتح Console وشغّل:
console.log('useAzkarTracking' in window);  // يجب أن يكون متاحاً من الـ import
console.log(localStorage.getItem('azkar_progress_morning')); // يجب أن يظهر البيانات
```

---

**كل شيء جاهز! 🎉 استمتع بالنظام الجديد!**
