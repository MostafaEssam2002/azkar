import { BookOpen, Clock3, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AZKAR_TYPES } from "../../utils/azkarStorage";
import { IconMosque } from "../../icons/HomeIcons";

/**
 * @param {{
 *   nextPrayerName : string,
 *   nextPrayerTime : string,
 *   countdown      : string,
 *   azkarType      : string,
 *   azkarCompleted : number,
 *   azkarTotal     : number,
 *   wirdPercentage : number,
 *   wirdPart       : number,
 * }} props
 */
const PrayerProgress = ({
  nextPrayerName,
  nextPrayerTime,
  countdown,
  azkarType,
  azkarCompleted,
  azkarTotal,
  wirdPercentage,
  wirdPart,
}) => {
  const navigate = useNavigate();
  const azkarFill = azkarTotal > 0 ? (azkarCompleted / azkarTotal) * 100 : 0;
  const isMorning = azkarType === AZKAR_TYPES.MORNING;
  const prayerStatus = countdown.startsWith("00") ? "الآن" : "قريبًا";
  const remainingToComplete = Math.max(0, 100 - Math.round(wirdPercentage));
  const ringSize = 170;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (azkarFill / 100) * circumference;

  const handleAzkarClick = () => {
    if (isMorning) {
      navigate("/azkar/أذكار-الصباح");
    } else {
      navigate("/azkar/أذكار-المساء");
    }
  };

  const handleWirdClick = () => {
    navigate("/wird");
  };

  return (
    <section className="home__section home__section--progress">
      <div className="home__progress-dashboard">
        <div className="home__progress-header">
          <div className="home__progress-header__title-wrap">
            <span className="home__progress-header__icon">
              <Sparkles size={16} />
            </span>
            <div className="home__section-title home__section-title--dashboard">تقدم اليوم</div>
          </div>
          <span className="home__progress-header__pill">موجز يومي</span>
        </div>

        <div className="home__progress-main-grid">
          <section className="home__progress-panel home__progress-panel--timer" aria-label="الوقت المتبقي حتى الصلاة القادمة">
            <div className="home__progress-panel__label-row">
              <Clock3 size={16} />
              <span>الوقت المتبقي</span>
            </div>
            <div className="home__progress-panel__timer" aria-live="polite">{countdown}</div>
            <div className="home__progress-panel__timer-meta">
              <span className="home__progress-panel__timer-meta-pill">{nextPrayerName}</span>
              <span>{nextPrayerTime}</span>
            </div>
          </section>

          <section className="home__progress-panel home__progress-panel--ring" aria-label="تقدم الأذكار اليومي">
            <div className="home__progress-ring-wrap">
              <svg className="home__progress-ring" width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
                <circle className="home__progress-ring__track" cx={ringSize / 2} cy={ringSize / 2} r={radius} />
                <circle
                  className="home__progress-ring__value"
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  style={{ strokeDasharray: circumference, strokeDashoffset: strokeOffset }}
                />
              </svg>
              <div className="home__progress-ring__inner">
                <span>{Math.round(azkarFill)}%</span>
              </div>
            </div>
            <div className="home__progress-ring__content">
              <span className="home__progress-ring__label">التقدم اليومي</span>
              <strong>{azkarCompleted} / {azkarTotal} أذكار</strong>
            </div>
          </section>
        </div>

        <div className="home__progress-cards-grid">
          <button
            className="home__progress-card home__progress-card--clickable"
            onClick={handleAzkarClick}
            type="button"
          >
            <div className="home__progress-card__header">
              <div className="home__progress-card__icon-wrap home__progress-card__icon-wrap--green">
                <Target size={18} />
              </div>
              <span className="home__progress-card__title">أذكار {isMorning ? "الصباح" : "المساء"}</span>
            </div>
            <div className="home__progress-card__value">{azkarCompleted} / {azkarTotal}</div>
            <div className="home__progress-card__meta">
              <span>{isMorning ? "من الفجر إلى الظهر" : "من العصر إلى الفجر"}</span>
              <span>{Math.round(azkarFill)}%</span>
            </div>
            <div className="home__progress-bar">
              <span style={{ width: `${Math.min(azkarFill, 100)}%` }} />
            </div>
          </button>

          <button
            className="home__progress-card home__progress-card--clickable"
            onClick={handleWirdClick}
            type="button"
          >
            <div className="home__progress-card__header">
              <div className="home__progress-card__icon-wrap home__progress-card__icon-wrap--gold">
                <BookOpen size={18} />
              </div>
              <span className="home__progress-card__title">الورد اليومي</span>
            </div>
            <div className="home__progress-card__value">{wirdPercentage}%</div>
            <div className="home__progress-card__meta">
              <span>الجزء {wirdPart}</span>
              <span>{remainingToComplete}% متبقي</span>
            </div>
            <div className="home__progress-bar home__progress-bar--gold">
              <span style={{ width: `${Math.min(wirdPercentage, 100)}%` }} />
            </div>
          </button>
        </div>

        <section className="home__progress-card home__progress-card--prayer" aria-label="معلومات الصلاة القادمة">
          <div className="home__progress-card__header home__progress-card__header--prayer">
            <div className="home__progress-card__icon-wrap home__progress-card__icon-wrap--dark">
              <IconMosque />
            </div>
            <div>
              <span className="home__progress-card__eyebrow">الصلاة القادمة</span>
              <h3 className="home__progress-card__prayer-name">{nextPrayerName}</h3>
            </div>
          </div>
          <div className="home__progress-card__prayer-footer">
            <div>
              <span className="home__progress-card__prayer-label">الوقت</span>
              <strong>{nextPrayerTime}</strong>
            </div>
            <div>
              <span className="home__progress-card__prayer-label">الحالة</span>
              <strong>{prayerStatus}</strong>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PrayerProgress;
