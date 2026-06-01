export function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

export function format12Hour(str) {
  const [h, m] = str.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')}${period}`;
}

export function formatCountdown(totalSecs) {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getNowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
}

export function findNextPrayer(times, KEYS) {
  const nowMin = getNowMinutes();
  for (let k of KEYS) {
    if (!times[k]) continue;
    const t = parseTime(times[k]);
    if (t > nowMin) return { key: k, minutes: t - nowMin, total: t - nowMin };
  }
  if (times['Fajr']) {
    const t = parseTime(times['Fajr']);
    return { key: 'Fajr', minutes: (24 * 60 - nowMin) + t, total: (24 * 60 - nowMin) + t };
  }
  return null;
}
