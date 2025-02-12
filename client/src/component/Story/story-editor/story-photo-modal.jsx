import { useEffect } from 'react';
import {IoCloseSharp} from "react-icons/io5";

const StoryPhotoModal = ({ isVisible, onClose, children }) => {

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
        className="fixed inset-0 bg-black/65 flex flex-col justify-center items-center z-[1000]"
        id="wrapper"
        onClick={handleClose}
      >
        <div className="absolute top-[40px] right-[40px] z-20">
          <button onClick={() => onClose()}>
            <IoCloseSharp className="text-[50px] text-gray-400 hover:text-gray-200 duration-500" />
          </button>
        </div>
        {/* Modal content */}
        <div className="relative bg-white p-5 rounded overflow-hidden z-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StoryPhotoModal;