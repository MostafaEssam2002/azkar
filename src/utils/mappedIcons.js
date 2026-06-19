import {BookOpen,Headphones,Radio,Clock,Bookmark,Sparkles,Star,Lock,Users,} from "lucide-react";
import {FacebookIcon,TelegramIcon,InstagramIcon,YoutubeIcon,XIcon,} from "../icons/HomeIcons";
export const platformLinks = [
    { icon: Sparkles, label: "الأذكار", href: "/azkar" },
    { icon: BookOpen, label: "القرآن الكريم", href: "/quran" },
    { icon: Headphones, label: "التلاوة", href: "/tilawa" },
    { icon: Radio, label: "الإذاعة الإسلامية", href: "/radio" },
    { icon: Clock, label: "مواقيت الصلاة", href: "/prayer_times" },
    { icon: Bookmark, label: "الورد القرآني", href: "/wird" },
];
export const socialLinks = [
    { icon: FacebookIcon, href: "#", label: "فيسبوك" },
    { icon: TelegramIcon, href: "#", label: "تيليجرام" },
    { icon: InstagramIcon, href: "#", label: "انستجرام" },
    { icon: YoutubeIcon, href: "#", label: "يوتيوب" },
    { icon: XIcon, href: "#", label: "إكس" },
];
export const features = [
    { icon: Clock, title: "متاح دائماً", subtitle: "على مدار الساعة" },
    { icon: Star, title: "جودة عالية", subtitle: "محتوى موثوق من مصادر معتمدة" },
    { icon: Lock, title: "موثوق وآمن", subtitle: "بياناتك محمية بالكامل" },
    { icon: Users, title: "مجتمع مسلم", subtitle: "نحو حياة إيمانية أفضل" },
];