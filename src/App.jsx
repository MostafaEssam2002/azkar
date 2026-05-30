import ZekrType from "./pages/ZekrType";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import QuranPage from "./pages/QuranPage";
import PlayAudio from "./pages/PlayAudio";
import SurahsList from './pages/SurahsList';
import SurahForReading from "./pages/SurahForReading";

function App() {
      const routing = createBrowserRouter([
        {
          path: "/",
          element: (
            <>
              <NavBar />
              <Outlet />
            </>
          ),
          children: [
            { index: true, element: <Navigate to="/azkar" replace /> },
            {
              path: "quran",
              element: <Outlet  />,
              children: [
                { index: true, element: <QuranPage /> },
                { path: "read", element: <SurahForReading /> },
                { path: "surahsList", element: <SurahsList /> },
                { path: "surahsList/play", element: <PlayAudio  /> },
                { path: "part/:part_id", element: <QuranPage /> },
                { path: "suwra/:suwra_id", element: <QuranPage /> },
              ]
            },
            {
              path: "azkar",
              children: [
                { index: true, element: <ZekrType type="أذكار الصباح" /> },
                { path: "أذكار-الصباح", element: <ZekrType type="أذكار الصباح" /> },
                { path: "أذكار-المساء", element: <ZekrType type="أذكار المساء" /> },
                { path: "أذكار-بعد-السلام-من-الصلاة-المفروضة", element: <ZekrType type="أذكار بعد السلام من الصلاة المفروضة" /> },
                { path: "تسابيح", element: <ZekrType type="تسابيح" /> },
                { path: "أذكار-النوم", element: <ZekrType type="أذكار النوم" /> },
                { path: "أذكار-الاستيقاظ", element: <ZekrType type="أذكار الاستيقاظ" /> },
                { path: "أدعية-القرآن", element: <ZekrType type="أدعية قرآنية" /> },
                { path: "أدعية-الأنبياء", element: <ZekrType type="أدعية الأنبياء" /> },
              ],
            },
          ]
        }
      ]);

      return <RouterProvider router={routing} />;
}

export default App;