import CounterButton from './CounterButton';
import ZekrContent from './ZekrContent';
const RowZekr = ({ count, description, content,basmala,reference , id }) => {
    return (
        <>
        <div className="rowZekrContainer">
            <CounterButton num={count} id={id+1} />
            <ZekrContent basmala={basmala} content={content} description={description} reference={reference} />
        </div>
        </>
    )
}
export default RowZekr