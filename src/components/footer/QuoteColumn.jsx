import SectionDivider from "./SectionDivider";

const QuoteColumn = () => (
  <div className="footer__column footer__column--quote">
    <h3 className="footer__heading">كلمة طيبة</h3>
    <SectionDivider />
    <div className="footer__quote-box">
      <span className="footer__quote-corner footer__quote-corner--tr" />
      <span className="footer__quote-corner footer__quote-corner--bl" />
      <p className="footer__quote-text">
        {"{"} وَاذْكُرْ رَبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً
        وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ بِالْغُدُوِّ وَالْآصَالِ
        وَلَا تَكُن مِّنَ الْغَافِلِينَ {"}"}
      </p>
      <span className="footer__quote-source">سورة الأعراف: 205</span>
    </div>
  </div>
);

export default QuoteColumn;
