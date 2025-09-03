export default function Card({ children, className, ...props }) {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white p-5 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}