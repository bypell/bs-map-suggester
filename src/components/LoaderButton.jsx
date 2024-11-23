export default function LoaderButton({ onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="
                h-12 ml-2
                px-6
                bg-less-dark rounded-xl shadow-md text-lg font-semibold outline-none
                transition-all duration-200
                active:bg-even-even-less-dark active:duration-100
                active:ring-2 active:ring-main
                hover:shadow-lg hover:duration-100 hover:bg-even-less-dark
                disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0 disabled:bg-less-dark
              ">Get suggestions
        </button>
    );
}