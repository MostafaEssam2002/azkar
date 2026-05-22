import { useState } from "react";

const CounterButton = ({ num, id }) => {
    const [count, setCount] = useState(num);

    const handleCount = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const resetCounter = (e) => {
        e.stopPropagation();
        setCount(num);
    };

    return (
        <div
            className={
                count < num
                    ? "counterSectionDecremented"
                    : "counterSection"
            }
            onClick={handleCount}
        >
            {/* الرقم + الانعكاس */}
            <div className="counterNumberWrapper">
                <button className="counterSectionButton">
                    {count}
                </button>

                <span className="counterShadow">
                    {num}
                </span>
            </div>

            {/* footer */}
            <div className="counterFooter">
                <button
                    className="counterSectionReset"
                    onClick={resetCounter}
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