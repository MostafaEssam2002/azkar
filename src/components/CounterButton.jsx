import { useState } from "react";

const CounterButton = ({ num, id }) => {
    const [count, setCount] = useState(num);

    const handleCount = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const handleReset = (e) => {
        e.stopPropagation();
        setCount(num);
    };

    return (
        <div
            className={count < num ? "counterSectionDecremented" : "counterSection"}
            onClick={handleCount}
        >
            <button className="counterSectionButton">
                {String(count).padStart(2, "0")}
            </button>

            <div className="counterShadow">
                {num}
            </div>

            <div className="counterFooter">
                <button
                    className="counterSectionReset"
                    onClick={handleReset}
                >
                    ↺
                </button>

                <span className="counterId">
                    {id}
                </span>
            </div>
        </div>
    );
};

export default CounterButton;