import chaptersData from "../../data/chapters.json";

const SuraSelector = ({ currentSura, onChange }) => (
    <div className="selector-wrapper">
        <select
            className="selector"
            value={currentSura}
            onChange={(e) => onChange(Number(e.target.value))}
        >
            {chaptersData.chapters.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.id}. {c.name_arabic}
                </option>
            ))}
        </select>
    </div>
);

export default SuraSelector;
