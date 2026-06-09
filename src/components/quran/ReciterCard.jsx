import { useState } from 'react';
import {   useNavigate } from 'react-router-dom';
const ReciterCard = ({id, name, ar_name, rawi, timing_url, server, surahs_count, surahs_list}) => {
    const navigate = useNavigate();
    const [surahs_lists, setSurahsLists] = useState(surahs_list);
    
    // ── Function to get the image based on reciter name ─────────────────────
    const getReciterImage = (reciterName) => {
        const imageMapping = {
            'أحمد بن علي العجمي': '/reciters_images/أحمد العجمي.jpg',
            'محمود خليل الحصري': '/reciters_images/محمود خليل الحصري.jpg',
            'إبراهيم الأخضر': '/reciters_images/إبراهيم الأخضر.jpg',
            'أبو بكر الشاطري': '/reciters_images/أبو بكر الشاطري.jpg',
            'أحمد نعينع': '/reciters_images/أحمد نعينع.jpg',
            'أكرم العلاقمي': '/reciters_images/أكرم العلاقمي.png',
            'ابراهيم الدوسري': '/reciters_images/ابراهيم الدوسري.jpg',
            'إبراهيم الدوسري': '/reciters_images/ابراهيم الدوسري.jpg',
            'أحمد الحواشي': '/reciters_images/أحمد الحواشي.jpg',
            'أحمد خضر الطرابلسي': '/reciters_images/أحمد خضر الطرابلسي.jpg',
            'أحمد خليل شاهين': '/reciters_images/أحمد خليل شاهين.jpg',
            'أحمد ديبان': '/reciters_images/أحمد ديبان.jpg',
            'إدريس أبكر': '/reciters_images/إدريس أبكر.png',
            'محمد عثمان': '/reciters_images/إذاعة محمد عثمان خان.jpg',
            'الدوكالي محمد العالم': '/reciters_images/الدوكالي محمد العالم.jpg',
            'سعد الغامدي': '/reciters_images/الشيخ-سعد-الغامدي.jpg',
            'العيون الكوشي': '/reciters_images/العيون الكوشي.jpg',
            'الفاتح محمد الزبير': '/reciters_images/الفاتح محمد الزبير.jpg',
            'بندر بليله': '/reciters_images/بندر بليلة.jpg',
            'توفيق الصايغ': '/reciters_images/توفيق الصايغ.jpg',
            'جمال شاكر عبدالله': '/reciters_images/جمال شاكر عبدالله.png',
            'جمعان العصيمي': '/reciters_images/جمعان العصيمي.jpg',
            'حاتم فريد الواعر': '/reciters_images/حاتم فريد الواعر.jpg',
            'خالد الجليل': '/reciters_images/خالد الجليل.jpg',
            'خالد القحطاني': '/reciters_images/خالد القحطاني.jpg',
            'خالد المهنا': '/reciters_images/خالد المهنا.jpg',
            'خالد عبدالكافي': '/reciters_images/خالد عبدالكافي.jpg',
            'خليفة الطنيجي': '/reciters_images/خليفة الطنيجي.png',
            'سعود الشريم': '/reciters_images/سعود-الشريم.jpg',
            'سهل ياسين': '/reciters_images/سهل ياسين.jpg',
            'سيد رمضان': '/reciters_images/سيد رمضان.jpg',
            'شيرزاد عبدالرحمن طاهر': '/reciters_images/شيرزاد عبدالرحمن طاهر.jpg',
            'صابر عبدالحكم': '/reciters_images/صابر عبدالحكم.jpg',
            'صلاح البدير': '/reciters_images/صلاح البدير.jpg',
            'صلاح الهاشم': '/reciters_images/صلاح الهاشم.jpg',
            'عبدالبارئ محمد': '/reciters_images/عبدالباري محمد.jpg',
            'صلاح بو خاطر': '/reciters_images/صلاح-بو-خاطر.jpg',
            'طارق عبدالغني دعوب': '/reciters_images/طارق عبدالغني دعوب.jpg',
            'عادل الكلباني': '/reciters_images/عادل الكلباني.jpg',
            'عادل ريان': '/reciters_images/عادل ريان.jpg',
            'عبدالبارئ الثبيتي': '/reciters_images/عبدالباري الثبيتي.jpg',
            'عبدالباسط عبدالصمد': '/reciters_images/عبدالباسط عبدالصمد.jpg',
            'عبدالرحمن السديس': '/reciters_images/عبدالرحمن السديس.jpg',
            'عبدالرحمن الشحات': '/reciters_images/عبدالرحمن الشحات.jpg',
            'عبدالرحمن الماجد': '/reciters_images/عبدالرحمن الماجد.jpg',
            'عبدالرشيد صوفي': '/reciters_images/عبدالرشيد صوفي.jpg',
            'عبدالعزيز الأحمد': '/reciters_images/عبدالعزيز الأحمد.jpg',
            'عبدالعزيز سحيم': '/reciters_images/عبدالعزيز سحيم.jpg',
            'عبدالله الخلف': '/reciters_images/عبدالله الخلف.jpg',
            'عبدالله الكندري': '/reciters_images/عبدالله الكندري.jpg',
            'عبدالله المطرود': '/reciters_images/عبدالله المطرود.jpg',
            'عبدالله الموسى': '/reciters_images/عبدالله الموسى.jpg',
            'عبدالله بصفر': '/reciters_images/عبدالله بصفر.jpg',
            'فارس عباد': '/reciters_images/فارس عباد.jpg',
            'ماجد الزامل': '/reciters_images/ماجد الزامل.jpg',
            'ماهر المعيقلي': '/reciters_images/ماهر المعيقلي.jpg',
            'ماهر شخاشيرو': '/reciters_images/ماهر شخاشيرو.jpg',
            'محمد أبو سنينة': '/reciters_images/محمد أبوسنينة.jpg',
            'محمد الأمين قنيوة': '/reciters_images/محمد الأمين قنيوة.jpg',
            'محمد الطبلاوي': '/reciters_images/محمد الطبلاوي.jpg',
            'محمد اللحيدان': '/reciters_images/محمد اللحيدان.jpg',
            'محمد أيوب': '/reciters_images/محمد أيوب.jpg',
            'محمد جبريل': '/reciters_images/محمد جبريل.jpg',
            'محمد رشاد الشريف': '/reciters_images/محمد رشاد الشريف.jpg',
            'محمد صالح عالم شاه': '/reciters_images/محمد صالح عالم شاه.jpg',
            'محمد صديق المنشاوي': '/reciters_images/محمد صديق المنشاوي.jpg',
            'محمد عبدالحكيم سعيد العبدالله': '/reciters_images/محمد عبدالحكيم سعيد العبدالله.jpg',
            'محمد عبدالكريم': '/reciters_images/محمد عبدالكريم.jpg',
            'محمود الرفاعي': '/reciters_images/محمود الرفاعي.jpg',
            'محمود الشيمي': '/reciters_images/محمود الشيمي.jpg',
            'محمود علي البنا': '/reciters_images/محمود علي البنا.jpg',
            'مشاري العفاسي': '/reciters_images/مشاري العفاسي.jpg',
            'مصطفى إسماعيل': '/reciters_images/مصطفى إسماعيل.jpg',
            'مصطفى اللاهوني': '/reciters_images/مصطفى اللاهوني.jpg',
            'مصطفى رعد العزاوي': '/reciters_images/مصطفى رعد العزاوي.jpg',
            'معيض الحارثي': '/reciters_images/معيض الحارثي.jpg',
            'مفتاح السلطني': '/reciters_images/مفتاح السلطني.jpg',
            'موسى بلال': '/reciters_images/موسى بلال.jpg',
            'ناصر العصفور': '/reciters_images/ناصر العصفور.jpg',
            'ناصر القطامي': '/reciters_images/ناصر القطامي.jpg',
            'ناصر الماجد': '/reciters_images/ناصر الماجد.jpg',
            'نبيل الرفاعي': '/reciters_images/نبيل الرفاعي.jpg',
            'نعمة الحسان': '/reciters_images/نعمة الحسان.jpg',
            'هاني الرفاعي': '/reciters_images/هاني الرفاعي.jpg',
            'هيثم الجدعاني': '/reciters_images/هيثم الجدعاني.jpg',
            'وليد النائحي': '/reciters_images/وليد النائحي.jpg',
            'ياسر الدوسري': '/reciters_images/ياسر الدوسري.jpg',
            'ياسر القرشي': '/reciters_images/ياسر القرشي.jpg',
            'ياسر المزروعي': '/reciters_images/ياسر المزروعي.jpg',
            'يحيى حوا': '/reciters_images/يحيى حوا.jpg',
            'يوسف الشويعي': '/reciters_images/يوسف الشويعي.jpg',
            'يوسف بن نوح أحمد': '/reciters_images/يوسف بن نوح أحمد.jpg',
            'عبدالله عواد الجهني': '/reciters_images/عبدالله عواد الجهني.jpg',
            'عبدالمحسن القاسم': '/reciters_images/عبدالمحسن القاسم.jpg',
            'علي جابر': '/reciters_images/علي جابر.jpg',
            'علي حجاج السويسي': '/reciters_images/علي حجاج السويسي.jpg',
            'ياسر سلامة': '/reciters_images/ياسر سلامة.jpg',
            'أحمد الحذيفي': '/reciters_images/أحمد الحذيفي.jpg',
            'أحمد السويلم': '/reciters_images/حمد السويلم.jpg',
            'أحمد الطرابلسي': '/reciters_images/أحمد خضر الطرابلسي.jpg',
            'أحمد النفيس': '/reciters_images/أحمد النفيس.jpg',
            'أحمد سعود': '/reciters_images/أحمد سعود.jpg',
            'أحمد صابر': '/reciters_images/أحمد صابر.jpg',
            'أحمد عامر': '/reciters_images/أحمد عامر.jpg',
            'أخيل عبدالحي': '/reciters_images/أخيل عبدالحي.jpg',
        };
        
        // Check if the reciter name contains any of the keys in the mapping
        for (const [key, imagePath] of Object.entries(imageMapping)) {
            if (reciterName && reciterName.includes(key)) {
                return imagePath;
            }
        }
        
        return '/book.png'; // Default image
    };
    
    return (
        <div className="reciter-card" dir="rtl">
        <div className="card-image">
            <img src={getReciterImage(name)} alt={name || "Quran"}/>
        </div>
        <div className="card-content">
        <div className="top-row">
            <div className="title-box">
                <h2>
                {name}
                </h2>
            </div>
        </div>
        <div className="info-row">
            <div className="info-item">
                <i className="fa-solid fa-wave-square"></i>
                <div>
                <span>نوع التلاوه:</span>
                <p>{ar_name}</p>
                </div>
            </div>
            <div className="divider"></div>
            <div className="info-item">
            <i className="fa-regular fa-user"></i>
            <div>
                <span>الراوي:</span>
                <p>{rawi}</p>
            </div>
            </div>
        </div>
        <div className="line"></div>
        <div className="links-row">
            <div className="link-item">
            <i className="fa-regular fa-clock"></i>
            <div>
                <span>رابط التوقيت:</span>
                <a href={timing_url} target="_blank"> {timing_url} </a>
            </div>
            </div>
            <div className="divider"></div>
            <div className="link-item">
            <i className="fa-solid fa-globe"></i>
            <div>
                <span>السيرفر:</span>
                <a href={server} target="_blank">
                {server}
                </a>
            </div>
            </div>
        </div>
        <div className="bottom-row">
            <button className="listen-btn" onClick={() =>navigate(`/tilawa/surahsList?url=${encodeURIComponent(server)}&name=${name}&surahs_list=${encodeURIComponent(JSON.stringify(surahs_list))}`)}>
                <i className="fa-solid fa-headphones"></i>
                استماع
            </button>
            <div className="surah-count">
            <i className="fa-solid fa-book-open"></i>
            <span>عدد السور:</span>
            <div className="count-box">{surahs_count }</div>
            </div>
        </div>
        </div>
    </div>
    )
}
export default ReciterCard;