import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/quran">القرآن</Link>
        </li>
        <li>
          <Link to="/azkar">الأذكار</Link>
        </li>
        <li>تلاوة</li>
        <li>الحديث</li>
        <li>مواقيت الصلاة</li>
      </ul>
    </nav>
  )
}

export default NavBar