import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseSharp } from 'react-icons/io5';

const PostUpdateModal = ({ isVisible, onClose, children }) => {
  const panelRef = useRef(null);

  /* ── Lock page scroll ───────────────────────────── */
  useEffect(() => {
    if (!isVisible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isVisible]);

  /* ── Close on ESC ───────────────────────────────── */
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible, onClose]);

  /* ── Click backdrop to close ────────────────────── */
  const handleBackdrop = (e) => {
    if (e.target.id === 'post-update-backdrop') onClose();
  };

  if (!isVisible) return null;

  return createPortal(
      <div
          id="post-update-backdrop"
          onClick={handleBackdrop}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
      >
        {/* Panel */}
        <div
            ref={panelRef}
            className="relative w-[90%] lsm:w-[80%] md:w-[70%] lg:w-[45%] max-h-[90vh]
                   bg-white rounded-xl shadow-xl overflow-y-auto
                   animate-[fade-in_0.25s_ease-out] p-6"
        >
          {/* Close button */}
          <button
              onClick={onClose}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center
                     rounded-full bg-gray-200 hover:bg-gray-300 transition"
              aria-label="Close modal"
          >
            <IoCloseSharp className="text-2xl text-gray-700 hover:text-gray-900" />
          </button>

          {/* Content */}
          {children}
        </div>
      </div>,
      document.body
  );
};

export default PostUpdateModal;
