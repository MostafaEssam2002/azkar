import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/quran/read">القرآن</Link>
        </li>
        <li>
          <Link to="/azkar">الأذكار</Link>
        </li>
        <li><Link to="/quran">تلاوة</Link></li>
        <li><Link to="/quran/radio">الاذاعه</Link></li>
        <li>مواقيت الصلاة</li>
      </ul>
    </nav>
  )
}

export default NavBar