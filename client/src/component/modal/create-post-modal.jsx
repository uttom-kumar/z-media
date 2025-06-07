import React, { useEffect, useRef } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const CreatePostModal = ({ isVisible, onClose, children }) => {
  const modalRef = useRef(null);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Close modal on pressing ESC key
  useEffect(() => {
    if (!isVisible) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isVisible, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.id === 'backdrop') {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
      <div
          id="backdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        {/* Modal Panel */}
        <div
            ref={modalRef}
            className="relative w-[90%] lsm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[40%] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl animate-fade-in-up transition-all duration-300 p-6"
        >
          {/* Close Button */}
          <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-300"
              aria-label="Close modal"
          >
            <IoCloseSharp size={32} />
          </button>

          {/* Modal Content */}
          {children}
        </div>
      </div>
  );
};

export default CreatePostModal;
