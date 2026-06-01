const ZekrContent = ({ content, basmala,reference ,description }) => {
    return (
        <div className="ZekrContent" dir="rtl">
            {reference && <h6 className="Reference">{reference}</h6>}
            {basmala && <h6 className="Basmala">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</h6>}
            <p className="ZekrText">
                {content}
            </p>
            <span className="ZekrDescription">
                {description}
            </span>
        </div>
    )
}
export default ZekrContent