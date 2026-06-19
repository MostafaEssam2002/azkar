import SectionDivider from "./SectionDivider";
import { platformLinks } from './../../utils/mappedIcons';

const PlatformColumn = () => (
  <div className="footer__column footer__column--platform">
    <h3 className="footer__heading">أقسام المنصة</h3>
    <SectionDivider />
    <ul className="footer__nav footer__nav--grid">
      {platformLinks.map(({ icon: Icon, label, href }) => (
        <li key={label} className="footer__nav-item">
          <a href={href} className="footer__nav-link">
            <span className="footer__nav-icon">
              <Icon size={17} strokeWidth={1.8} />
            </span>
            <span>{label}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default PlatformColumn;
