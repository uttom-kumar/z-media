import React, {useEffect} from 'react';
import {IoCloseSharp} from "react-icons/io5";

const PostUpdateModal = ({ isVisible, onClose, children }) => {
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
        className="fixed inset-0 bg-black/65 flex flex-col justify-center items-center z-[999999] "
        id="wrapper"
        onClick={handleClose}
      >
        <div className="absolute top-[40px] right-[40px] z-20">
          <button onClick={() => onClose()}>
            <IoCloseSharp className="text-[50px] text-gray-400 hover:text-gray-200 duration-500" />
          </button>
        </div>
        {/* Modal content */}
        <div className="p-5 w-[90%] lsm:w-[80%] md:w-[70%] lg:w-[40%] h-auto bg-white rounded z-[99999]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PostUpdateModal;