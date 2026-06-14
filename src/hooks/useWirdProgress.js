import { useState, useEffect, useCallback } from "react";

const DEFAULT_STATE = { percentage: 0, part: 0, currentPage: 0 };

function calcWirdProgress() {
  try {
    const settings = JSON.parse(localStorage.getItem("wird_settings")) || {};
    const progress = JSON.parse(localStorage.getItem("wird_progress")) || {};

    // ── الصفحة الحالية ───────────────────────────────────────
    let currentPage = 1;
    const raw = localStorage.getItem("wird_current_page");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.page >= 1) currentPage = parsed.page;
      } catch (_) {}
    }

    // ── حساب نطاق الورد ──────────────────────────────────────
    const pagesPerDay           = settings.pagesPerDay           || 1;
    const accumulatedMissedPages = progress.accumulatedMissedPages || 0;
    const wirdCompleted         = progress.wirdCompleted          || false;
    const nextPageStart         = progress.nextPageStart || settings.startPage || 1;

    const totalPagesInWird = pagesPerDay + accumulatedMissedPages;
    const wirdStart = Math.min(Math.max(1, nextPageStart), 604);
    const wirdEnd   = Math.min(wirdStart + totalPagesInWird - 1, 604);

    // ── النسبة ───────────────────────────────────────────────
    let percentage = 0;
    if (wirdCompleted) {
      percentage = 100;
    } else if (currentPage >= wirdStart && currentPage <= wirdEnd) {
      const pagesRead  = Math.max(0, currentPage - wirdStart);
      const totalPages = wirdEnd - wirdStart + 1;
      if (totalPages > 0) percentage = Math.round((pagesRead / totalPages) * 100);
    } else if (currentPage > wirdEnd) {
      percentage = 100;
    }

    const part = Math.ceil(wirdStart / 20.13);

    return {
      percentage:  Math.min(100, Math.max(0, percentage)),
      part:        Math.max(1,  Math.min(30, part)),
      currentPage,
    };
  } catch (err) {
    console.error("useWirdProgress error:", err);
    return DEFAULT_STATE;
  }
}

/**
 * يقرأ تقدم الورد اليومي من localStorage
 * ويستمع لأي تغييرات (storage / wirdProgressUpdated)
 */
function useWirdProgress() {
  const [wirdProgress, setWirdProgress] = useState(DEFAULT_STATE);

  const update = useCallback(() => setWirdProgress(calcWirdProgress()), []);

  useEffect(() => {
    update();
    window.addEventListener("storage",              update);
    window.addEventListener("wirdProgressUpdated",  update);
    return () => {
      window.removeEventListener("storage",             update);
      window.removeEventListener("wirdProgressUpdated", update);
    };
  }, [update]);

  return wirdProgress;
}

export default useWirdProgress;
