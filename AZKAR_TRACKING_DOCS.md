# نظام تتبع الأذكار الذكي
## Smart Azkar Tracking System

نظام شامل لتتبع أذكار الصباح والمساء مع إشعارات ذكية وحفظ التقدم.

---

## 📋 المحتويات

1. [المميزات](#المميزات)
2. [البنية الهندسية](#البنية-الهندسية)
3. [الملفات المنشأة](#الملفات-المنشأة)
4. [التعليمات](#التعليمات)
5. [أمثلة الاستخدام](#أمثلة-الاستخدام)
6. [التخزين المحلي](#التخزين-المحلي)
7. [التكامل مع الموقع](#التكامل-مع-الموقع)

---

## ✨ المميزات

### 1️⃣ **تحديد الفترات الزمنية ذكياً**
- **أذكار الصباح**: من أذان الفجر إلى أذان الظهر
- **أذكار المساء**: من أذان العصر إلى أذان الفجر (اليوم التالي)

### 2️⃣ **نظام الإشعارات الذكي**
- 🔔 إشعارات تلقائية تذكر المستخدم بالأذكار في الوقت المناسب
- 🎯 رسائل مخصصة لكل نوع ذكر (صباح/مساء)
- ⏸️ عدم تكرار الإشعارات المزعجة

### 3️⃣ **حفظ التقدم الذكي**
- 📊 حفظ جميع الأذكار المقروءة في localStorage
- 🔄 استمرار من حيث توقفت عند الرجوع للموقع
- ⏰ حذف البيانات تلقائياً بعد انتهاء الفترة الزمنية

### 4️⃣ **عرض مرئي للتقدم**
- 📈 شريط تقدم ديناميكي
- 📋 إحصائيات مفصلة (المقروء/الكلي)
- ⏱️ الوقت المتبقي من الفترة الزمنية

---

## 🏗️ البنية الهندسية

```
hooks/
├── useAzkarTracking.js        # إدارة التقدم والتخزين
└── useAzkarNotifications.js   # نظام الإشعارات

components/
├── AzkarTracker.jsx           # عرض شريط التقدم والإحصائيات
└── azkar/
    └── (مكونات الأذكار الموجودة)

pages/
├── ZekrTypeEnhanced.jsx       # نسخة محسّنة من صفحة الأذكار
└── (صفحات أخرى)

styles/components/
├── _azkar-tracker.scss        # نمط شريط التتبع
└── _zekr-type-enhanced.scss   # نمط صفحة الأذكار المحسّنة
```

---

## 📁 الملفات المنشأة

### 1. `useAzkarTracking.js` (Hook)
**المسؤول عن**: تتبع التقدم والتخزين

**الدوال الرئيسية**:
```javascript
useAzkarTracking(azkarType)
// Returns: {
//   progress: { readItems: [], startedAt },
//   currentPeriod: { type, isActive, timeRemaining },
//   markAsRead(itemIndex),
//   unmarkAsRead(itemIndex),
//   isItemRead(itemIndex),
//   getStats(totalItems),
//   resetProgress(),
//   canTrack: boolean
// }
```

**ثوابت**:
```javascript
AZKAR_TYPES = {
  MORNING: 'morning',   // أذكار الصباح
  EVENING: 'evening'    // أذكار المساء
}
```

---

### 2. `useAzkarNotifications.js` (Hook)
**المسؤول عن**: الإشعارات الذكية

**الدوال الرئيسية**:
```javascript
useAzkarNotifications(enabled = true)
// Returns: {
//   notificationPermission: boolean,
//   toggleNotifications(),
//   sendManualNotification(type)
// }
```

---

### 3. `AzkarTracker.jsx` (مكون)
**المسؤول عن**: عرض شريط التقدم والإحصائيات

**Props**:
```javascript
{
  stats: { read, total, percentage, remaining },
  period: { type, isActive, timeRemaining },
  onNotificationToggle: function,
  notificationEnabled: boolean
}
```

---

### 4. `ZekrTypeEnhanced.jsx` (صفحة)
**المسؤول عن**: صفحة الأذكار مع التتبع المدمج

---

## 📚 التعليمات

### الخطوة 1: استيراد الملفات الأساسية

```javascript
// في صفحة الأذكار
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';
import AzkarTracker from '../components/AzkarTracker';
```

### الخطوة 2: استخدام Hooks

```javascript
const MyAzkarPage = ({ type }) => {
  const [azkarType, setAzkarType] = useState(AZKAR_TYPES.MORNING);
  
  // Hook التتبع
  const tracking = useAzkarTracking(azkarType);
  
  // Hook الإشعارات
  const notifications = useAzkarNotifications(true);
  
  // تتبع قراءة الأذكار
  const handleZekrRead = (index) => {
    tracking.markAsRead(index);
  };
  
  // الحصول على الإحصائيات
  const stats = tracking.getStats(azkarArray.length);
  
  return (
    <>
      <AzkarTracker 
        stats={stats} 
        period={tracking.currentPeriod}
        onNotificationToggle={notifications.toggleNotifications}
        notificationEnabled={notifications.notificationPermission}
      />
      {/* باقي المحتوى */}
    </>
  );
};
```

### الخطوة 3: تحديث الأنماط

أضف الاستيراد في ملف الأنماط الرئيسي:

```scss
// في src/styles/main.scss
@import './components/_azkar-tracker.scss';
@import './components/_zekr-type-enhanced.scss';
```

---

## 💡 أمثلة الاستخدام

### مثال 1: تتبع بسيط

```javascript
const { markAsRead, isItemRead, getStats } = useAzkarTracking('morning');

// وضع علامة على الذكر كمقروء
markAsRead(0);

// التحقق من قراءة الذكر
if (isItemRead(0)) {
  console.log('تم قراءة هذا الذكر');
}

// الحصول على الإحصائيات
const stats = getStats(10); // { read: 1, total: 10, percentage: 10, remaining: 9 }
```

### مثال 2: التحقق من فترة الذكر

```javascript
const { currentPeriod, canTrack } = useAzkarTracking('morning');

if (canTrack) {
  console.log('في فترة الذكر الحالي');
  console.log(`النوع: ${currentPeriod.type}`); // 'morning' أو 'evening'
  console.log(`الوقت المتبقي: ${currentPeriod.timeRemaining} دقيقة`);
}
```

### مثال 3: الإشعارات

```javascript
const { toggleNotifications, sendManualNotification } = useAzkarNotifications();

// تبديل الإشعارات
toggleNotifications();

// إرسال إشعار يدوي
sendManualNotification('morning');
```

---

## 💾 التخزين المحلي

### مفاتيح التخزين

```javascript
// حفظ التقدم
azkar_progress_morning  // تقدم أذكار الصباح
azkar_progress_evening  // تقدم أذكار المساء

// الهيكل المحفوظ
{
  readItems: [0, 2, 5],           // مؤشرات الأذكار المقروءة
  startedAt: 1719341400000,       // توقيت البداية
  timestamp: 1719341500000,       // آخر تحديث
  period: { type, isActive, ... } // معلومات الفترة
}
```

### دورة حياة البيانات

```
بداية الفترة الزمنية
    ↓
يقرأ المستخدم أذكاراً → يتم الحفظ في localStorage
    ↓
يغلق المستخدم الموقع
    ↓
يعود المستخدم أثناء الفترة → استرجاع البيانات المحفوظة
    ↓
انتهاء الفترة الزمنية → حذف البيانات تلقائياً
```

---

## 🔌 التكامل مع الموقع

### تحديث الصفحات الموجودة

#### خيار 1: إنشاء صفحة جديدة (موصى)
استخدم `ZekrTypeEnhanced.jsx` كصفحة جديدة تماماً

#### خيار 2: تحديث الصفحة الموجودة
قم بتحديث `ZekrType.jsx` الموجودة:

```javascript
// src/pages/ZekrType.jsx
import useAzkarTracking from '../hooks/useAzkarTracking';
import useAzkarNotifications from '../hooks/useAzkarNotifications';
import AzkarTracker from '../components/AzkarTracker';

const ZekrType = ({ type }) => {
  const [azkar, setAzkar] = useState([]);
  const [azkarType, setAzkarType] = useState(null);
  
  const tracking = useAzkarTracking(azkarType);
  const notifications = useAzkarNotifications(true);
  
  // ... باقي الكود
  
  return (
    <>
      <AzkarTracker {...} />
      {/* باقي المحتوى */}
    </>
  );
};
```

### تحديث الـ Routes

إذا استخدمت `ZekrTypeEnhanced.jsx`:

```javascript
// في ملف التوجيه (Router config)
import ZekrTypeEnhanced from './pages/ZekrTypeEnhanced';

routes = [
  // ... routes أخرى
  {
    path: '/azkar/:type',
    element: <ZekrTypeEnhanced type={type} />
  }
];
```

---

## 🔐 ملاحظات أمان وأداء

### الأمان
- ✅ البيانات محفوظة محلياً فقط (لا ترسل إلى الخادم)
- ✅ لا توجد معلومات حساسة في localStorage
- ✅ البيانات تُحذف تلقائياً بعد انتهاء الفترة

### الأداء
- ✅ الـ Hooks خفيفة الوزن
- ✅ التحديثات محسّنة (لا إعادة render غير ضرورية)
- ✅ الإشعارات تُرسل بحد أدنى من الـ API calls

### الخصوصية
- ✅ الإشعارات تعتمد على إذن المستخدم
- ✅ يمكن للمستخدم إيقاف الإشعارات بسهولة
- ✅ لا تتبع خارجي

---

## 🐛 استكشاف الأخطاء

### الإشعارات لا تظهر
1. تحقق من إذن الإشعارات: `Notification.permission`
2. تأكد من أن المتصفح يدعم الإشعارات
3. تحقق من أن `notificationPermission` هو `true`

### البيانات لا تُحفظ
1. تحقق من أن `localStorage` متاح
2. تأكد من عدم تجاوز حد التخزين
3. افتح Developer Tools وافحص localStorage

### الوقت المتبقي غير صحيح
1. تحقق من دقة أوقات الصلاة من PrayerContext
2. تأكد من صحة المنطقة الزمنية

---

## 📞 الدعم والمساعدة

للأسئلة أو المشاكل:
1. افحص وحدة التحكم (Console) للأخطاء
2. تحقق من ملف localStorage
3. اختبر مع أنواع مختلفة من الأذكار

---

## 📝 الملاحظات الهامة

⚠️ **تنبيه**: 
- تأكد من استيراد جميع الملفات الأساسية
- قد تحتاج إلى تحديث الـ Router للتعامل مع الأنواع الجديدة
- الإشعارات تتطلب إذن صريح من المستخدم

---

**آخر تحديث**: 2026-06-11
**الإصدار**: 1.0.0
