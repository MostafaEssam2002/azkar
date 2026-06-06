import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#d32f2f', fontSize: '2.5rem', marginBottom: '20px' }}>
        ❌ حدث خطأ!
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '15px' }}>
        {error?.status === 404 ? 'الصفحة غير موجودة' : 'حدث خطأ غير متوقع'}
      </p>
      {error?.statusText && (
        <p style={{ fontSize: '1rem', color: '#999', marginBottom: '20px' }}>
          {error.statusText}
        </p>
      )}
      {error?.message && (
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px', fontFamily: 'monospace' }}>
          {error.message}
        </p>
      )}
      <a
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '20px'
        }}
      >
        العودة للرئيسية
      </a>
    </div>
  );
}
