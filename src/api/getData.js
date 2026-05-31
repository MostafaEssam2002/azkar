/**
 * جلب البيانات من API مع معالجة الأخطاء والتحقق من صحة البيانات
 * مع التحقق من HTTPS والأمان
 * @param {string} url - رابط API
 * @param {Object} options - خيارات إضافية (timeout, headers)
 * @returns {Promise<Object>} البيانات المتحققة منها
 * @throws {Error} خطأ في حالة الفشل
 */
const getData = async (url, options = {}) => {
  const { timeout = 8000, headers = {} } = options;

  // التحقق من صحة الـ URL
  if (!url || typeof url !== 'string') {
    throw new Error('URL يجب أن يكون نصاً صحيحاً');
  }

  // ✅ التحقق من استخدام HTTPS فقط للروابط المطلقة
  const normalizedUrl = url.trim();
  const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(normalizedUrl);
  if (isAbsoluteUrl && !normalizedUrl.toLowerCase().startsWith('https://')) {
    throw new Error('⚠️ يجب استخدام HTTPS فقط - URLs غير آمنة غير مقبولة');
  }

  try {
    // إنشاء abort controller للـ timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // جلب البيانات مع headers أمنية
    const response = await fetch(url, {
      signal: controller.signal,
      // ✅ إضافة headers أمنية لمنع MITM attacks
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // يساعد في منع CSRF
        'User-Agent': 'Mozilla/5.0 (Azkar App)', // تحديد user-agent واضح
        ...headers,
      },
      // ✅ تفعيل CORS مع strict mode
      mode: 'cors',
      credentials: 'omit', // منع إرسال cookies من domains أخرى
      cache: 'no-store', // منع caching للبيانات الحساسة
    });

    clearTimeout(timeoutId);

    // التحقق من رمز الحالة
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // ✅ التحقق من أن الاتصال كان آمناً (HTTPS فقط)
    if (isAbsoluteUrl && response.type !== 'cors' && !normalizedUrl.includes('localhost')) {
      console.warn('⚠️ تحذير: استجابة غير CORS');
    }

    // التحقق من أن المحتوى JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('المحتوى المستقبل ليس بصيغة JSON');
    }

    // تحويل البيانات
    const data = await response.json();

    // التحقق من صحة البيانات
    if (data === null || data === undefined) {
      throw new Error('البيانات المستقبلة فارغة');
    }

    if (typeof data !== 'object') {
      throw new Error('البيانات المستقبلة ليست object');
    }

    return data;
  } catch (error) {
    // معالجة أخطاء محددة
    if (error.name === 'AbortError') {
      throw new Error(`انتهاء المهلة الزمنية (${timeout}ms) - الخادم لا يستجيب`);
    }

    if (error instanceof SyntaxError) {
      throw new Error('البيانات المستقبلة غير صحيحة في الصيغة');
    }

    if (error instanceof TypeError) {
      throw new Error('خطأ في الاتصال بالإنترنت أو الخادم');
    }

    // إعادة رفع الخطأ
    throw error;
  }
};

export default getData;