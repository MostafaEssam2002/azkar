import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Middleware لإضافة Security Headers
const securityHeadersMiddleware = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // ✅ HTTP CSP (أكثر تحديداً من meta CSP)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' https://api.quranpedia.net https://cdn.quranpedia.net https://quranenc.com https://cdn.islamic.network https://api.aladhan.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net; media-src 'self' https://cdn.islamic.network https://quranenc.com https://backup.qurango.net; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ تحسين الأمان: Proxy مع SSL verification
    proxy: {
      '/api': {
        target: 'https://api.quranpedia.net/v1', // ✅ HTTPS فقط
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // ✅ تفعيل SSL verification (منع MITM attacks)
        secure: true, // تحقق من SSL certificates
        agent: false, // استخدام default Node.js HTTPS agent
        headers: {
          // ✅ إضافة security headers
          'X-Requested-With': 'XMLHttpRequest',
          'X-Custom-Auth': 'azkar-app-v1',
        },
        onError: (err) => {
          console.error('❌ Proxy Error - قد يكون هناك مشكلة في SSL:', err.message);
        },
      }
    },
    // ✅ إضافة Security Headers Middleware
    middlewares: [securityHeadersMiddleware],
  },
})