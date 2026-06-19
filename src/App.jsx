import ZekrType from "./pages/ZekrType";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import QuranPage from "./pages/QuranPage";
import PlayAudio from "./pages/PlayAudio";
import SurahsList from './pages/SurahsList';
import SurahForReading from "./pages/SurahForReading";
// import Test from "./components/Test";
import { PrayerProvider } from "./components/PrayerContext";
import RadioApp from "./pages/RadioApp";
import PrayerTimes from './pages/PrayerTimes';
import ErrorBoundary from "./components/ErrorBoundary";
import WirdPage from './pages/WirdPage';
import Home from "./pages/Home";
import Footer from "./components/Footer";

function RootLayout() {
  const location = useLocation();
  const shouldHideFooter = location.pathname === "/prayer_times";

  return (
    <PrayerProvider>
      <div className="app-shell">
        <NavBar />
        <main className="app-shell__content">
          <Outlet />
        </main>
        {!shouldHideFooter && <Footer />}
      </div>
    </PrayerProvider>
  );
}

function App() {
      const routing = createBrowserRouter([
        {
          path: "/",
          element: <RootLayout />,
          errorElement: <ErrorBoundary />,
          children: [
            { index: true, element: <Home /> },
            // { index: true, element: <Navigate to="/azkar" replace /> },
            { path: "prayer_times", element: <PrayerTimes /> },
            { path: "wird", element: <WirdPage /> },
            { path: "radio", element: <RadioApp /> },
            { path: "quran", element: <SurahForReading /> },
            {
              path: "tilawa",
              element: <Outlet  />,
              children: [
                { index: true, element: <QuranPage /> },
                { path: "surahsList", element: <SurahsList /> },
                { path: "surahsList/play", element: <PlayAudio  /> },
                { path: "part/:part_id", element: <QuranPage /> },
                { path: "suwra/:suwra_id", element: <QuranPage /> },
              ]
            },
            {
              path: "azkar",
              children: [
                { index: true, element: <ZekrType key="morning" type="أذكار الصباح" /> },
                { path: "أذكار-الصباح", element: <ZekrType key="morning" type="أذكار الصباح" /> },
                { path: "أذكار-المساء", element: <ZekrType key="evening" type="أذكار المساء" /> },
                { path: "أذكار-بعد-السلام-من-الصلاة-المفروضة", element: <ZekrType type="أذكار بعد السلام من الصلاة المفروضة" /> },
                { path: "تسابيح", element: <ZekrType type="تسابيح" /> },
                { path: "أذكار-النوم", element: <ZekrType type="أذكار النوم" /> },
                { path: "أذكار-الاستيقاظ", element: <ZekrType type="أذكار الاستيقاظ" /> },
                { path: "أدعية-القرآن", element: <ZekrType type="أدعية قرآنية" /> },
                { path: "أدعية-الأنبياء", element: <ZekrType type="أدعية الأنبياء" /> },
              ],
            },
          ]
        },
        {
          path: "*",
          element: <ErrorBoundary />,
        }
      ]);

      return <RouterProvider router={routing} />;
}

export default App;