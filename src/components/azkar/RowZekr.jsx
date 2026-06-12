import CounterButton from './CounterButton';
import ZekrContent from './ZekrContent';

const RowZekr = ({ count, description, content, basmala, reference, id, categoryKey, onCountChange }) => {
    return (
        <>
        <div className="rowZekrContainer">
            <CounterButton num={count} id={id+1} categoryKey={categoryKey} onCountChange={onCountChange} />
            <ZekrContent basmala={basmala} content={content} description={description} reference={reference} />
        </div>
        </>
    )
}
export default RowZekr