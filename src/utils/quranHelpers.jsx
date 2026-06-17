// export const WAQF_MARKS = [
//     "\u06D6","\u06D7","\u06D8","\u06D9","\u06DA",
//     "\u06DB","\u06DC","\u06DD","\u06DE","\u06DF",
//     "\u06E0","\u06E9",
// ];
export const WAQF_MARKS = [
  "\u06D6", // ۖ
  "\u06D7", // ۗ
  "\u06D8", // ۘ
  "\u06D9", // ۙ
  "\u06DA", // ۚ
  "\u06DB", // ۛ
  "\u06DC", // ۜ
  "\u06DD", // ۝
  "\u06DE", // ۞
  "\u06DF", // ۟
  "\u06E0", // ۠
  "\u06E1", // ۡ
  "\u06E2", // ۢ
  "\u06E3", // ۣ
  "\u06E4", // ۤ
  "\u06E5", // ۥ
  "\u06E6", // ۦ
  "\u06E7", // ۧ
  "\u06E8", // ۨ
  "\u06E9", // ۩
  "\u06EA", // ۪
  "\u06EB", // ۫
  "\u06EC", // ۬
  "\u06ED", // ۭ
];
const WAQF_REGEX = new RegExp(`([${WAQF_MARKS.join("")}])`, "g");

export const highlightWaqf = (text) => {
    if (!WAQF_MARKS.some(m => text.includes(m))) return text;
    const parts = text.split(WAQF_REGEX);
    return parts.map((part, i) =>
        WAQF_MARKS.includes(part)
            ? <span key={i} className="waqf-mark">{part}</span>
            : part
    );
};

export const generateBars = (count = 32) =>
    Array.from({ length: count }, (_, i) =>
        6 + Math.abs(Math.sin(i * 0.35) * 16) + Math.random() * 7
    );

export const BAR_HEIGHTS = generateBars(32);