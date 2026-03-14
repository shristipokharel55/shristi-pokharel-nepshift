const RupeeIcon = ({ size = 20, className = '' }) => {
    const fontSize = Math.max(12, Math.round(size * 0.72));
    return (
        <span
            className={`inline-flex items-center justify-center font-bold leading-none ${className}`}
            style={{ width: size, height: size, fontSize }}
            aria-hidden="true"
        >
            रु
        </span>
    );
};
export default RupeeIcon;
