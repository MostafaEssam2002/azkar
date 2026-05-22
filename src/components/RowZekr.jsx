import CounterButton from './CounterButton';
import ZekrContent from './ZekrContent';
const RowZekr = () => {
    return (
        <>
        <div className="rowZekrContainer">
            <CounterButton num={100} id={1} />
            <ZekrContent basmala={false} />
        </div>
        <div className="rowZekrContainer">
            <CounterButton num={100} id={1} />
            <ZekrContent basmala={true} />
        </div>
        </>
    )
}
export default RowZekr