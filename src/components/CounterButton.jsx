import { useState } from "react";

const CounterButton = ({ num }) => {
    const [count, setCount] = useState(num);

    const handleCount = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };
    return (
        <div className={count < num ? "counterSectionDecremented":"counterSection"} onClick={handleCount}>
            <button className="counterSectionButton">
                {String(count).padStart(2, "0")}
            </button>
            <div className="counterShadow">
                {num}
            </div>
            <button
                className="counterSectionReset"
                onClick={(e) => {
                    e.stopPropagation(); // يمنع decrement
                    setCount(num);
                }}
            >
                ↺
            </button>

        </div>
    );
};

export default CounterButton;