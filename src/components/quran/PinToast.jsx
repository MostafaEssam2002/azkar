const PinToast = ({ visible }) => (
    <div className={`pin-toast ${visible ? "pin-toast--visible" : "pin-toast--hidden"}`}>
        📌 تم حفظ موقفك!
    </div>
);

export default PinToast;
