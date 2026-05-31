// مثال على الاستخدام الآمن للـ API
import getData from './getData.js';

// ✅ استخدام صحيح - HTTPS فقط
const fetchQuranData = async () => {
  try {
    // هذا سينجح ✓
    const reciters = await getData('https://api.quranpedia.net/v1/reciters');
    console.log('Reciters:', reciters);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// ❌ استخدام خاطئ - HTTP بدون S
const fetchWithHttp = async () => {
  try {
    // هذا سيفشل ✗
    const data = await getData('http://api.quranpedia.net/v1/reciters');
  } catch (error) {
    console.error('Error:', error.message);
    // سيطبع: ⚠️ يجب استخدام HTTPS فقط - URLs غير آمنة غير مقبولة
  }
};

// ✅ استخدام مع custom headers
const fetchWithCustomHeaders = async () => {
  try {
    const data = await getData('https://api.quranpedia.net/v1/reciters', {
      timeout: 10000,
      headers: {
        'Authorization': 'Bearer token-if-needed'
      }
    });
    console.log('Data with custom headers:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

export { fetchQuranData, fetchWithHttp, fetchWithCustomHeaders };
