const ErrorState = ({ onRetry }) => (
    <div className="error-container">
        <i className="fa-solid fa-triangle-exclamation error-icon"></i>
        <p>فشل في تحميل القراء</p>
        <button className="error-retry-btn" onClick={onRetry}>
            إعادة المحاولة
        </button>
    </div>
);

export default ErrorState;
