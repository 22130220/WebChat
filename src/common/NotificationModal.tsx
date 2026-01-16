type NotificationModalProps = {
    message: string;
    returnPage?: () => void;
}

function notificationModal({ message, returnPage }: NotificationModalProps) {
    return <div id="notificationModal"
        className="fixed inset-0 bg-white/70 z-50 bg-opacity-80 flex items-center justify-center"
        aria-hidden="true">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative animate-fadeIn">
            <button id="closeModalBtn"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close">
                ✕
            </button>

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h2 className="text-lg font-semibold text-center mt-4">Thành công!</h2>

            <p className="text-gray-600 text-center mt-2">
                {message}
            </p>

            <div className="mt-6 text-center">
                <button id="okBtn"
                    onClick={returnPage}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none">
                    OK
                </button>
            </div>
        </div>
    </div>

}
export default notificationModal;