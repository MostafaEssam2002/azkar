import { useEffect, useState } from 'react';
import Confetti from '../wird/Confetti';

const AzkarCompletion = ({ active }) => {
  const [show, setShow] = useState(active);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [active]);

  if (!show) {
    return null;
  }

  return (
    <div className="azkar-completion-toast">
      <Confetti active={show} />
      <div className="azkar-completion-card">
        <h3>🎉 تمّ إكمال الورد!</h3>
        <p>مبارك عليك، لقد أنهيت جميع أذكار اليوم.</p>
      </div>
    </div>
  );
};

export default AzkarCompletion;
