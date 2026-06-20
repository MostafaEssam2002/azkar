import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QUICK_LINKS = [
  {
    title: "تلاوة",
    description: "استمع للقرآن الكريم بأصوات أكثر من 200 قارئ من مختلف أنحاء العالم",
    image: "/cards/tilawa.png",
    path: "/tilawa",
    btn: "تلاوة القرآن"
  },
  {
    title: "القرآن",
    description: "اقرأ القرآن الكريم مع حفظ موضع القراءة والعودة إليه في أي وقت",
    image: "/cards/quran.png",
    path: "/quran",
    btn: "استمع الآن"
  },
  {
    title: "الأذكار",
    description: "حصّن يومك بأذكار الصباح والمساء والنوم والسفر وأكثر",
    image: "/cards/azkar.png",
    path: "/azkar",
    btn: "تصفح الأذكار"
  },
  {
    title: "مواقيت الصلاة",
    description: "اعرف أوقات الصلاة بدقة واحصل على تنبيهات للأذان حسب موقعك",
    image: "/cards/times.png",
    path: "/prayer_times",
    btn: "عرض الأوقات"
  },
  {
    title: "الورد اليومي",
    description: "نظّم ختمتك اليومية وتابع تقدمك في قراءة القرآن بسهولة",
    image: "/cards/wird.png",
    path: "/wird",
    btn: "متابعة الورد"
  },
  {
    title: "الإذاعة",
    description: "إذاعات قرآنية ودروس ومحاضرات إسلامية متاحة على مدار الساعة",
    image: "/cards/radio.jpg",
    path: "/radio",
    btn: "استمع الآن"
  },
];

const QuickAccess = () => {
  const navigate = useNavigate();

  return (
    <section className="home__section home__section--quick">
      <div className="home__quick-header">
        <div className="home__quick-header__decor" aria-hidden="true">
          <span className="home__quick-header__line" />
          <span className="home__quick-header__dot" />
          <span className="home__quick-header__line" />
        </div>
        <div className="home__quick-header__content">
          <div className="home__quick-header__title-wrap">
            <h2 className="home__quick-header__title">الوصول السريع</h2>
          </div>
          <p className="home__quick-header__subtitle">استكشف أبرز خدمات المنصة</p>
        </div>
      </div>
      <div className="home__quick-grid">
        {QUICK_LINKS.map(({ title, description, image, path, btn }) => (
          <button
            key={title}
            className="home__quick-item"
            type="button"
            onClick={() => navigate(path)}
          >
            <div className="home__quick-image-wrap">
              <img
                className="home__quick-image"
                src={image}
                alt={title}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="home__quick-content">
              <h3 className="home__quick-title">{title}</h3>
              <p className="home__quick-description">{description}</p>
            </div>
            <div className="home__quick-footer">
              <span className="home__quick-btn">
                <span>{btn}</span>
                <ArrowLeft size={16} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickAccess;