/**
 * SurahSeparator
 * ──────────────
 * فاصل بين السور داخل نفس الصفحة.
 * يُستخدم مع .surah-group wrapper من surah-separator.scss
 */

export default function SurahSeparator({ surahName, surahEnglishName, showBasmala }) {
    return (
        <div className="surah-separator" dir="rtl">
            <div className="surah-separator__name-row">
                <span className="surah-separator__name-ar">{surahName}</span>
                <span className="surah-separator__name-en">{surahEnglishName}</span>
            </div>

            <div className="surah-separator__divider" />
        </div>
    );
}
