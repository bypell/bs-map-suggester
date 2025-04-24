export default function Spinner({ size = 8, thickness = 4 }) {
    return (
        (<div
            className="rounded-full animate-spin border-solid border-gray-400 border-t-transparent"
            style={{
                width: `${size * 4}px`,
                height: `${size * 4}px`,
                borderWidth: `${thickness}px`,
            }}>
        </div>)
    );
}