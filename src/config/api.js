export const API_CONFIG = {
  aladhan: import.meta.env.VITE_ALADHAN_API_BASE || 'https://api.aladhan.com',
  alquran: import.meta.env.VITE_ALQURAN_CLOUD_API_BASE || 'https://api.alquran.cloud/v1',
  quranHub: import.meta.env.VITE_QURANHUB_API_BASE || 'https://api.quranhub.com/v1',
  quranEnc: import.meta.env.VITE_QURANENC_API_BASE || 'https://quranenc.com/api/v1',
  alfurqan: import.meta.env.VITE_ALFURQAN_API_BASE || 'https://alfurqan.online/api/v1',
  recitersApi: import.meta.env.VITE_RECITERS_API_URL || '/api/reciters',
};

export const buildApiUrl = (base, path = '') => {
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
};
