import { useEffect } from 'react';
import {IoCloseSharp} from "react-icons/io5";

const SettingModal = ({ isVisible, onClose, children }) => {

  // Disable background scrolling when modal is visible
  useEffect(() => {
    if (isVisible) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scroll
      document.body.style.overflow = 'auto';
    }
    // Cleanup when modal is unmounted or isVisible changes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  if (!isVisible) return null;

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/65 flex flex-col justify-center items-center animate-fade-in z-[1000]"
        id="wrapper"
        onClick={handleClose}
      >
        <div className="absolute top-[60px] right-[10px] lg:top-[40px] md:right-[40px] z-[999999]">
          <button onClick={() => onClose()} className="cursor-pointer">
            <IoCloseSharp className="text-[50px] text-gray-400 hover:text-gray-200 duration-500" />
          </button>
        </div>
        {/* Modal content */}
        <div className="w-[90%] md:w-[400px] bg-white rounded overflow-hidden z-[99999] ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;