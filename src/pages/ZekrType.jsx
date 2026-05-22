import { Fragment, useEffect, useRef, useState } from "react";
import azkarData from "../data/adkar.json";
import RowZekr from "../components/RowZekr";
import AzkarBox from "../components/AzkarBox";
const ZekrType = ({ type }) => {
    const [azkar, setAzkar] = useState([]);
    useEffect(() => {
        setAzkar(azkarData[type] || []);
    }, [type]);
    return (
        <>

            <div className="zekrType">
                <AzkarBox />
                <div className="pageTitle">
                    <h6>{type}</h6>
                </div>
                {azkar.map((zekr, index) => (
                    <RowZekr key={`${type}-${index}`} reference={zekr.reference} count={zekr.count} description={zekr.description} content={zekr.content} basmala={zekr.basmala} id={index} />
                ))}
            </div>
        </>
    )
}

export default ZekrType