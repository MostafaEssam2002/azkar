import ZekrType from "./pages/ZekrType";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
// import Main from "./components/quran/Main";
import QuranPage from "./pages/QuranPage";
function App() {
      const routing = createBrowserRouter([
        // redirect root to /azkar
        { path: "/", element: <Navigate to="/azkar" replace /> },
        {path: "/quran" , element: <QuranPage /> , children:[
          { index: true, element: <QuranPage /> },
          {path: "part/:part_id" , element: <QuranPage />},
          {path: "suwra/:suwra_id" , element: <QuranPage />},
        ]},
        {
          path: "/azkar",children: [
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
        
      ])
    return (
        <>
          <NavBar></NavBar>
          <RouterProvider router={routing}>
          </RouterProvider>
        </>
    );
}

export default App;