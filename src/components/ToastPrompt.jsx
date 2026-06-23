// ToastPrompt.jsx
// Presentational component — لا يعرف أي حاجة عن الـ storage أو الـ routing
// كل الـ logic بتيجي من الـ parent عن طريق الـ props

const ToastPrompt = ({ text, storageKey, yesRoute, noRoute, onDismiss, onAnswer }) => (
  <div className="friday-kahf-toast" dir="rtl">
    <button
      type="button"
      className="friday-kahf-toast__close"
      aria-label="إغلاق الإشعار"
      onClick={() => onDismiss(storageKey)}
    >
      ×
    </button>

    <div className="friday-kahf-toast__text">{text}</div>

    <div className="friday-kahf-toast__actions">
      <button
        type="button"
        className="friday-kahf-toast__button friday-kahf-toast__button--no"
        onClick={() => onAnswer(storageKey, "no", noRoute)}
      >
        لا
      </button>
      <button
        type="button"
        className="friday-kahf-toast__button friday-kahf-toast__button--yes"
        onClick={() => onAnswer(storageKey, "yes", yesRoute)}
      >
        نعم
      </button>
    </div>
  </div>
);

export default ToastPrompt;