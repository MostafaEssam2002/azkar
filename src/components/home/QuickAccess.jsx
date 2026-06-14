import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHeadphones,
  IconBook,
  IconSun,
  IconClock,
  IconCalendar,
  IconRadio,
} from './../../icons/HomeIcons';

const QUICK_LINKS = [
  { icon: <IconHeadphones />, label: "تلاوة",         path: "/tilawa"       },
  { icon: <IconBook />,       label: "القرآن",        path: "/quran"        },
  { icon: <IconSun />,        label: "الأذكار",       path: "/azkar"        },
  { icon: <IconClock />,      label: "مواقيت الصلاة", path: "/prayer_times" },
  { icon: <IconCalendar />,   label: "الورد اليومي",  path: "/wird"         },
  { icon: <IconRadio />,      label: "الإذاعة",       path: "/radio"        },
];

const QuickAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="home__section">
      <div className="home__section-title">الوصول السريع</div>
      <div className="home__quick-grid">
        {QUICK_LINKS.map(({ icon, label, path }) => (
          <button
            key={label}
            className="home__quick-item"
            onClick={() => navigate(path)}
          >
            <div className="home__quick-icon">{icon}</div>
            <span className="home__quick-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
