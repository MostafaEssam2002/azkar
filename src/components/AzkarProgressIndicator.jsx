/**
 * AzkarProgressIndicator — مكون مصغر لعرض التقدم بسيط
 * 
 * مفيد إذا كنت تريد عرض التقدم في أماكن مختلفة من الموقع
 * (مثل الـ Header أو القائمة الجانبية)
 */

import { useContext } from 'react';
import useAzkarTracking, { AZKAR_TYPES } from '../hooks/useAzkarTracking';

export default function AzkarProgressIndicator({ type = AZKAR_TYPES.MORNING }) {
  const tracking = useAzkarTracking(type);
  
  if (!tracking.canTrack) {
    return null; // لا تعرض شيء إذا لم تكن في الفترة الزمنية
  }

  const stats = tracking.getStats(100); // استخدم عدد افتراضي
  
  return (
    <div className="azkar-progress-mini">
      <span className="icon">
        {type === AZKAR_TYPES.MORNING ? '🌅' : '🌙'}
      </span>
      <div className="progress-bar-mini">
        <div 
          className="progress-fill" 
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
      <span className="text">{Math.round(stats.percentage)}%</span>
    </div>
  );
}

// الأنماط
const styles = `
.azkar-progress-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-size: 12px;

  .icon {
    font-size: 16px;
  }

  .progress-bar-mini {
    width: 60px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: #4ade80;
      transition: width 0.3s ease;
    }
  }

  .text {
    font-weight: 600;
    min-width: 25px;
    text-align: right;
  }
}
`;
