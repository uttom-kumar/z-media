import React, {useEffect} from 'react';
import {IoCloseSharp} from "react-icons/io5";

const ModalComponent = ({ isVisible, onClose, children }) => {

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
            className="fixed inset-0 flex flex-col justify-center items-center z-50"
            id="wrapper"
            onClick={handleClose}
            style={{background:"rgba(0, 0, 0, 0.1)"}}
          >
              <div
                className="p-5 h-auto rounded relative z-[99999]">
                  {children}
                  <div className="absolute top-[25px] right-[40px] z-[999999] w-[35px] h-[35px] rounded-full bg-gray-300 flex flex-col justify-center items-center">
                      <button className="cursor-pointer" onClick={() => onClose()}>
                          <IoCloseSharp className="text-[30px] text-gray-800 hover:text-gray-500 duration-500"/>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default ModalComponent;