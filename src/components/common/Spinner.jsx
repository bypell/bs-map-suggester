export default function Spinner({ size = 8, thickness = 4 }) {
    return (
        (<div
            className={`w-${size} h-${size} rounded-full animate-spin absolute border-${thickness} border-solid border-gray-400 border-t-transparent`}>
        </div>)
    );
}