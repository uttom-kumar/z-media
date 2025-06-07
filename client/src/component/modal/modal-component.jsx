import React, { useEffect, useRef } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const ModalComponent = ({ isVisible, onClose, children }) => {
    const modalRef = useRef(null);

    // Scroll lock on open
    useEffect(() => {
        if (isVisible) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isVisible]);

    // ESC to close
    useEffect(() => {
        if (!isVisible) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isVisible, onClose]);

    // Click outside to close
    const handleBackdropClick = (e) => {
        if (e.target.id === 'backdrop') onClose();
    };

    if (!isVisible) return null;

    return (
        <div
            id="backdrop"
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-2xl p-6 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto animate-fade-in"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-3 right-3 z-[999] w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                    aria-label="Close modal"
                >
                    <IoCloseSharp className="text-xl text-gray-700 hover:text-gray-900 transition" />
                </button>

                {/* Modal Content */}
                {children}
            </div>
        </div>
    );
};

export default ModalComponent;
