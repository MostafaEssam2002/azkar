import { useNavigate } from "react-router-dom";

const AzkarBox = () => {
    const navigate = useNavigate();
    const buttons = [
        {text : "أذكار الصباح",route:"/أذكار-الصباح"},
        {text : "أذكار المساء",route:"/أذكار-المساء"},
        {text : "أذكار بعد السلام من الصلاة المفروضة",route:"/أذكار-بعد-السلام-من-الصلاة-المفروضة"},
        {text : "تسابيح",route:"/تسابيح"},
        {text : "أذكار النوم",route:"/أذكار-النوم"},
        {text : "أذكار الاستيقاظ",route:"/أذكار-الاستيقاظ"},
        {text : "أدعية قرآنية",route:"/أدعية-القرآن"},
        {text : "أدعية الأنبياء",route:"/أدعية-الأنبياء"},
    ];
    return (
        <div className="azkar-box">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    onClick={() => {
                        const route = String(button.route || "");
                        const clean = route.replace(/^\/+/, "");
                        const target = `/azkar/${clean}`;
                        navigate(target);
                    }}
                >
                    {button.text}
                </button>
            ))}
        </div>
    )
}
export default AzkarBox