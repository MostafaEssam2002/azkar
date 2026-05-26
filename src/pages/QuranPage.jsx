import { useEffect, useRef, useState } from 'react';
import ReciterCard from '../components/quran/ReciterCard';
import getData from './../api/getData';

const QuranPage = () => {
    const ref = useRef(false);

    const [reciters, setReciters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchReciters() {

            if (ref.current) return;
            ref.current = true;

            try {
                setLoading(true);

                const res = await getData("/api/reciters");

                const flattenedData = res.flat();

                const filteredData = flattenedData.filter(
                    (reciter) =>
                        reciter.classification.name === "حسب السور"
                );

                setReciters(filteredData);

            } catch (error) {
                console.error("Error fetching reciters:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReciters();

    }, []);

    return (
        <div className="quranPage" dir="rtl">

            {/* Spinner */}
            {loading ? (
                <div className="spinnerContainer">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            ) : (
                reciters.map((reciter) => (
                    <ReciterCard
                        key={reciter.id}
                        id={reciter.id}
                        name={reciter.name}
                        ar_name={reciter.recitation_type.ar_name}
                        rawi={reciter.rawi.name}
                        timing_url={reciter.timing_url}
                        server={reciter.server}
                        surahs_count={reciter.surahs_list?.length || 0}
                    />
                ))
            )}

        </div>
    );
};

export default QuranPage;