import { useState } from 'react';
import {   useNavigate } from 'react-router-dom';
const ReciterCard = ({id, name, ar_name, rawi, timing_url, server, surahs_count, surahs_list}) => {
    const navigate = useNavigate();
    const [surahs_lists, setSurahsLists] = useState(surahs_list);
    return (
        <div className="reciter-card" dir="rtl">
        <div className="card-image">
            <img src="/book.png" alt="Quran"/>
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
            <button className="listen-btn" onClick={() =>navigate(`/quran/surahsList?url=${encodeURIComponent(server)}&name=${name}&surahs_list=${encodeURIComponent(JSON.stringify(surahs_list))}`)}>
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