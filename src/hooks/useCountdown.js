import { useState, useEffect } from "react";

/**
 * يرجع الوقت المتبقي حتى target بصيغة HH:MM:SS
 * @param {Date} target
 */
function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const diff = Math.max(0, target - now);
      const h = String(Math.floor(diff / 3_600_000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60_000)  /  1_000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

export default useCountdown;
