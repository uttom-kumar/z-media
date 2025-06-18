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
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all"
        >
            <div
                ref={modalRef}
                className="relative w-[92%] sm:w-[85%] md:w-[70%] lg:w-[55%] xl:w-[40%] max-h-[90vh] overflow-y-auto bg-white rounded-2xl  animate-fade-in-up scale-100 transition-transform duration-300 px-6"
            >
                {/*/!* Close Button *!/*/}
                {/*<button*/}
                {/*    onClick={onClose}*/}
                {/*    className="z-50 cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition"*/}
                {/*    aria-label="Close modal"*/}
                {/*>*/}
                {/*    <IoCloseSharp className="text-2xl" />*/}
                {/*</button>*/}

                {/* Modal Content */}
                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
