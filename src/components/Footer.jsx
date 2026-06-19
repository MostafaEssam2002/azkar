import BottomBar from './footer/BottomBar';
import BrandColumn from './footer/BrandColumn';
import PlatformColumn from './footer/PlatformColumn';
import QuoteColumn from './footer/QuoteColumn';
const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="footer__grid">
        <BrandColumn />
        <PlatformColumn />
        <QuoteColumn />
      </div>
    </div>
    <BottomBar />
  </footer>
);

export default Footer;
