/**
 * TESTING_GUIDE.md
 * 
 * دليل اختبار نظام تتبع الأذكار
 */

# 🧪 دليل الاختبار الشامل

## البيئة المطلوبة للاختبار

- متصفح حديث (Chrome, Firefox, Safari, Edge)
- أدوات المطور (F12)
- اتصال إنترنت (لجلب أوقات الصلاة)

---

## 🔍 الاختبارات الأساسية

### 1️⃣ اختبار الفترات الزمنية

#### الهدف
التأكد من تحديد فترات الذكر بشكل صحيح

#### الخطوات
```javascript
// في Console (F12)

// 1. استيراد الدالة
import { calculateCurrentAzkarPeriod } from '/src/hooks/useAzkarTracking.js';

// 2. الحصول على أوقات الصلاة
const prayerTimes = {
  Fajr: '05:30',
  Dhuhr: '12:45',
  Asr: '16:00',
  Maghrib: '19:20'
};

// 3. اختبار الفترة
const period = calculateCurrentAzkarPeriod(prayerTimes);
console.log('الفترة الحالية:', period);

// 4. التحقق من النتائج
console.assert(period.isActive, '❌ الفترة يجب أن تكون نشطة');
console.assert(period.type === 'morning' || period.type === 'evening', 
  '❌ النوع يجب أن يكون morning أو evening');
console.assert(period.timeRemaining > 0, 
  '❌ الوقت المتبقي يجب أن يكون موجب');

console.log('✅ اختبار الفترات نجح');
```

#### النتائج المتوقعة
```
✅ الفترة الحالية: {
  type: "morning",      // أو "evening"
  isActive: true,
  timeRemaining: 240,   // دقائق
  startTime: 330,       // دقائق من منتصف الليل
  endTime: 765
}
```

---

### 2️⃣ اختبار حفظ البيانات

#### الهدف
التأكد من حفظ واسترجاع البيانات بشكل صحيح

#### الخطوات
```javascript
// 1. افتح صفحة ذكار
// مثال: http://localhost:3000/azkar/أذكار-الصباح

// 2. انقر على عدة أذكار لوضع علامات عليها
// يجب أن تظهر علامات ✓ على الأذكار

// 3. افتح localStorage في Console
localStorage.getItem('azkar_progress_morning')

// 4. الفحص
console.log(localStorage.getItem('azkar_progress_morning'));
```

#### النتائج المتوقعة
```javascript
{
  "readItems": [0, 1, 3, 5],
  "startedAt": 1719341400000,
  "timestamp": 1719341500000,
  "period": {
    "type": "morning",
    "isActive": true,
    "timeRemaining": 240
  }
}
```

#### الفحوصات
- ✓ البيانات محفوظة في localStorage
- ✓ المفتاح صحيح (`azkar_progress_morning` أو `azkar_progress_evening`)
- ✓ `readItems` تحتوي على المؤشرات الصحيحة
- ✓ `timestamp` حالي (قريب من الوقت الحالي)

---

### 3️⃣ اختبار استمرار البيانات

#### الهدف
التأكد من أن البيانات تستمر عند إعادة تحميل الصفحة

#### الخطوات
```
1. افتح صفحة الأذكار
2. ضع علامات على عدة أذكار
3. لاحظ شريط التقدم (يجب أن يظهر النسبة)
4. اضغط F5 (إعادة تحميل الصفحة)
5. تحقق: هل العلامات والتقدم موجودان؟
```

#### النتائج المتوقعة
- ✓ العلامات تبقى بعد إعادة التحميل
- ✓ شريط التقدم يحافظ على نسبته
- ✓ الإحصائيات صحيحة

---

### 4️⃣ اختبار الإشعارات

#### الهدف
التأكد من عمل نظام الإشعارات

#### الخطوات
```javascript
// 1. تفعيل الإشعارات
// اضغط على الزر 🔔 في شريط التقدم

// 2. يجب أن يطلب المتصفح إذن الإشعارات
// اختر "السماح" أو "Allow"

// 3. تحقق من الإذن
console.log('إذن الإشعارات:', Notification.permission);
// يجب أن يظهر: "granted"

// 4. إرسال اختبار
if (Notification.permission === 'granted') {
  new Notification('اختبار الإشعار', {
    body: 'هذا اختبار للتأكد من عمل الإشعارات'
  });
}
```

#### النتائج المتوقعة
- ✓ ظهور رسالة طلب الإذن من المتصفح
- ✓ ظهور الإشعار بعد الموافقة
- ✓ زر الجرس يتغير لـ 🔔 (موصول)

---

### 5️⃣ اختبار الحذف التلقائي

#### الهدف
التأكد من حذف البيانات بعد انتهاء الفترة الزمنية

#### الخطوات
```javascript
// 1. افتح صفحة الأذكار أثناء فترة النشاط
// ضع علامات على بعض الأذكار

// 2. تحقق من التخزين
console.log(localStorage.getItem('azkar_progress_morning'));
// يجب أن يظهر البيانات

// 3. انتظر حتى انتهاء الفترة الزمنية
// أو اختبر عن طريق تعديل الوقت (اختياري)

// 4. افتح الصفحة بعد انتهاء الفترة
console.log(localStorage.getItem('azkar_progress_morning'));
// يجب أن يظهر: null (محذوفة)
```

#### النتائج المتوقعة
- ✓ البيانات موجودة أثناء الفترة النشطة
- ✓ البيانات محذوفة بعد انتهاء الفترة

---

## 🧬 اختبارات الوحدات

### اختبار `useAzkarTracking`

```javascript
// ملف اختبار مثالي: useAzkarTracking.test.js
import { renderHook, act } from '@testing-library/react';
import useAzkarTracking from '../hooks/useAzkarTracking';

describe('useAzkarTracking', () => {
  
  test('وضع علامة على عنصر', () => {
    const { result } = renderHook(() => useAzkarTracking('morning'));
    
    act(() => {
      result.current.markAsRead(0);
    });
    
    expect(result.current.isItemRead(0)).toBe(true);
  });
  
  test('حساب الإحصائيات بشكل صحيح', () => {
    const { result } = renderHook(() => useAzkarTracking('morning'));
    
    act(() => {
      result.current.markAsRead(0);
      result.current.markAsRead(1);
    });
    
    const stats = result.current.getStats(10);
    expect(stats.read).toBe(2);
    expect(stats.total).toBe(10);
    expect(stats.percentage).toBe(20);
  });
  
  test('إزالة علامة من عنصر', () => {
    const { result } = renderHook(() => useAzkarTracking('morning'));
    
    act(() => {
      result.current.markAsRead(0);
      result.current.unmarkAsRead(0);
    });
    
    expect(result.current.isItemRead(0)).toBe(false);
  });
  
  test('إعادة تعيين التقدم', () => {
    const { result } = renderHook(() => useAzkarTracking('morning'));
    
    act(() => {
      result.current.markAsRead(0);
      result.current.markAsRead(1);
      result.current.resetProgress();
    });
    
    expect(result.current.isItemRead(0)).toBe(false);
    expect(result.current.isItemRead(1)).toBe(false);
  });
});
```

---

## 🔧 اختبارات الأداء

### قياس الأداء

```javascript
// قياس سرعة الحفظ
console.time('saveProgress');
for (let i = 0; i < 100; i++) {
  tracking.markAsRead(i);
}
console.timeEnd('saveProgress');
// يجب أن يكون أقل من 50ms

// قياس سرعة الاسترجاع
console.time('getStats');
const stats = tracking.getStats(10000);
console.timeEnd('getStats');
// يجب أن يكون أقل من 10ms
```

---

## 🐛 اختبارات معالجة الأخطاء

### السيناريوهات المختلفة

```javascript
// 1. عندما يكون localStorage ممتلئ
test('التعامل مع localStorage الممتلىء', () => {
  // حاول ملء localStorage
  // لا يجب أن يحدث crash
});

// 2. عندما تكون أوقات الصلاة غير متاحة
test('التعامل مع عدم توفر أوقات الصلاة', () => {
  const period = calculateCurrentAzkarPeriod(null);
  expect(period.isActive).toBe(false);
});

// 3. بيانات localStorage تالفة
test('التعامل مع بيانات تالفة في localStorage', () => {
  localStorage.setItem('azkar_progress_morning', 'invalid json');
  // يجب أن يستخدم القيم الافتراضية
});
```

---

## 📱 اختبارات الاستجابة

### على أجهزة مختلفة

```
الهاتف الذكي (375px):
- ✓ شريط التقدم يتناسب مع الشاشة
- ✓ الإحصائيات موجودة بشكل صحيح
- ✓ الزر 🔔 يعمل بسهولة

التابليت (768px):
- ✓ التخطيط مناسب
- ✓ جميع العناصر مرئية

الحاسوب (1200px+):
- ✓ التخطيط محسّن
- ✓ المباعدات صحيحة
```

---

## ✅ قائمة الفحص النهائية

- [ ] تحديد الفترات الزمنية صحيح
- [ ] الحفظ والاسترجاع يعمل
- [ ] الاستمرار من حيث توقفت
- [ ] الحذف التلقائي يعمل
- [ ] الإشعارات تظهر
- [ ] الأداء جيد (< 100ms)
- [ ] معالجة الأخطاء تعمل
- [ ] الاستجابة على جميع الأجهزة

---

## 🎯 نصائح الاختبار

1. **استخدم أجهزة مختلفة** للاختبار
2. **اختبر في أوقات مختلفة** من اليوم
3. **اختبر مع متصفحات مختلفة**
4. **تحقق من Console** للأخطاء
5. **اختبر مع وبدون إنترنت**

---

**استمتع بالاختبار!** 🧪

آخر تحديث: 2026-06-11
