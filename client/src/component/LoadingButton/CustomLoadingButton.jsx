
const CustomLoadingButton = ({ text, onClick, type, isLoading, disabled, className }) => {
    const isButtonDisabled = isLoading || disabled;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isButtonDisabled}
            className={`
        w-full flex justify-center items-center gap-2 py-2 rounded transition text-white
        ${isButtonDisabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'} 
        ${className}
      `}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                    ></path>
                </svg>
            )}
            {isLoading ? 'Loading...' : text}
        </button>
    );
};
export default CustomLoadingButton;