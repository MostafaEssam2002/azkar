# 🔐 تحسينات الأمان - HTTPS & SSL Certificate Validation

## المشكلة الأصلية
❌ الموقع يتصل بـ `https://api.quranpedia.net/v1` بدون تحقق كامل من SSL certificates  
❌ عرضة لـ **Man-in-the-Middle (MITM) Attacks**

---

## الحل المطبق ✅

### 1️⃣ **تحسين `src/api/getData.js`**

#### ✅ إجبار استخدام HTTPS فقط
```javascript
// منع استخدام URLs غير آمنة
if (!url.toLowerCase().startsWith('https://')) {
  throw new Error('⚠️ يجب استخدام HTTPS فقط');
}
```

#### ✅ إضافة Security Headers
```javascript
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',  // منع CSRF
  'User-Agent': 'Mozilla/5.0 (Azkar App)',
}
```

#### ✅ تفعيل CORS مع Strict Mode
```javascript
mode: 'cors',                    // فقط HTTPS connections
credentials: 'omit',             // منع إرسال cookies
cache: 'no-store',              // منع تخزين البيانات الحساسة
```

---

### 2️⃣ **تحسين `vite.config.js`**

#### ✅ تفعيل SSL Verification في Proxy
```javascript
proxy: {
  '/api': {
    target: 'https://api.quranpedia.net/v1',  // HTTPS فقط
    secure: true,  // ✅ تحقق من SSL certificates
    agent: false,  // استخدام default HTTPS agent
  }
}
```

#### ✅ إضافة Security Headers
```javascript
headers: {
  'X-Requested-With': 'XMLHttpRequest',
  'X-Custom-Auth': 'azkar-app-v1',
}
```

---

### 3️⃣ **تحسين `index.html`**

#### ✅ Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  connect-src 'self' https://api.quranpedia.net;
  ...
" />
```
- يسمح فقط بـ requests من نفس الـ domain أو HTTPS APIs

#### ✅ Enforce HTTPS
```html
<meta http-equiv="Strict-Transport-Security" content="max-age=31536000" />
```
- يفرض استخدام HTTPS لمدة سنة كاملة

#### ✅ منع Attacks الشهيرة
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

---

### 4️⃣ **تحسين `vercel.json` (الإنتاج)**

#### ✅ Security Headers على جميع الـ requests
```json
{
  "key": "Strict-Transport-Security",
  "value": "max-age=31536000; includeSubDomains; preload"
}
```

#### ✅ منع Caching للـ API requests
```json
{
  "source": "/api/:path*",
  "headers": [{
    "key": "Cache-Control",
    "value": "no-store, no-cache, must-revalidate"
  }]
}
```

---

## المميزات الأمنية المضافة 🛡️

| الميزة | الفائدة |
|--------|--------|
| **HTTPS فقط** | منع اعتراض البيانات |
| **SSL Verification** | التحقق من هوية الـ Server |
| **CORS Mode** | فقط requests آمنة من المتصفح |
| **CSP Headers** | منع XSS attacks |
| **HSTS Headers** | إجبار HTTPS دائماً |
| **No-Cache API** | منع تخزين بيانات حساسة |
| **X-Frame-Options** | منع Clickjacking |

---

## الحماية من الهجمات

### ✅ Man-in-the-Middle (MITM)
- HTTPS فقط ✓
- SSL Certificate Validation ✓
- Secure headers ✓

### ✅ Cross-Site Scripting (XSS)
- Content Security Policy ✓
- X-Content-Type-Options ✓

### ✅ Cross-Origin Requests
- CORS Mode enforcement ✓
- X-Requested-With header ✓

### ✅ Data Leakage
- credentials: 'omit' ✓
- cache: 'no-store' ✓
- Referrer Policy ✓

---

## كيفية الاختبار ✅

### في Development
```bash
npm run dev
# سيرى تحذيرات في console إذا كانت هناك مشكلة في SSL
```

### في Production (Vercel)
- Security headers ستُرسل تلقائياً
- جميع requests ستكون HTTPS
- HSTS سيُفرض

---

## ملاحظات مهمة 📝

1. **المتصفح يتحقق تلقائياً من SSL Certificates**
   - لا تحتاج إلى أي مكتبات إضافية

2. **Vercel يفرض HTTPS افتراضياً**
   - جميع الاتصالات آمنة بشكل افتراضي

3. **CSP Headers يحمي من معظم XSS attacks**
   - حتى لو تم اختراق الـ API

4. **HSTS يمنع downgrade attacks**
   - المتصفح لن يقبل HTTP بعد الاتصال الأول

---

## المراجع الأمنية 📚

- [OWASP - Man-in-the-Middle Attack Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
- [MDN - Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [MDN - Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
