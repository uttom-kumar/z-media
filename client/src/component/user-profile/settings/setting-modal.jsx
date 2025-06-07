import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseSharp } from 'react-icons/io5';

/* --- focus-trap helper ---------------------------------------------- */
const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableSelectors =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const nodes = containerRef.current.querySelectorAll(focusableSelectors);
    if (!nodes.length) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    const handleTab = e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };

    first.focus();
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isActive, containerRef]);
};

/* --- modal component ------------------------------------------------- */
// eslint-disable-next-line react/prop-types
const SettingModal = ({isVisible, onClose, children, maxWidth = 'md:max-w-lg'}) => {
  const wrapperRef = useRef(null);

  // Disable background scroll while open
  useEffect(() => {
    if (isVisible) {
      const { overflow } = document.body.style;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [isVisible]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!isVisible) return;
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isVisible, onClose]);

  useFocusTrap(isVisible, wrapperRef);

  if (!isVisible) return null;

  return createPortal(
      <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          onMouseDown={e => e.target === e.currentTarget && onClose()}
      >
        {/* panel */}
        <div
            ref={wrapperRef}
            className={`w-[90%] ${maxWidth} rounded-lg bg-white shadow-2xl overflow-hidden
        transform transition-all duration-300 ease-out
        animate-modal-enter
        `}
        >
          {children}
        </div>
      </div>,
      document.body, // portal target
  );
};

export default SettingModal;
