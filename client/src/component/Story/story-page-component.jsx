import React, {useState} from 'react';
import {FaPhotoVideo} from "react-icons/fa";
import {IoText} from "react-icons/io5";
import {Link} from "react-router-dom";
import StoryPhotoModal from "./story-editor/story-photo-modal.jsx";
import StoryPhotoEditor from "./story-editor/story-photo-editor.jsx";

const StoryPageComponent = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="block md:flex space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        {/* Photo Story Card */}
        <button
          onClick={() => setShowModal(!showModal)}
          className="bg-gradient-to-br from-blue-500 to-blue-300 rounded-lg p-8 flex flex-col items-center justify-center w-full h-[200px] lsm:w-[160px] lsm:h-[300px] md:w-64 md:h-96">
          <div className="bg-black rounded-full p-4 mb-4">
            <FaPhotoVideo  className="text-white text-[24px]" />
          </div>
          <p className="text-white text-[16px] md:text-lg font-semibold">Create a Photo Story</p>
        </button>
        {/* Text Story Card */}
        <Link to={`/create-text-story`}
          className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg p-8 flex flex-col items-center justify-center w-full h-[200px] lsm:w-[160px] lsm:h-[300px] md:w-64 md:h-96">
          <div className="bg-black rounded-full p-4 mb-4">
            <IoText  className="text-white text-[24px]" />
          </div>
          <p className="text-white text-[16px] md:text-lg font-semibold">Create a Text Story</p>
        </Link>
      </div>

      <div>
        <StoryPhotoModal isVisible={showModal} onClose={() => setShowModal(false)}>
          <StoryPhotoEditor onClose={setShowModal}/>
        </StoryPhotoModal>
      </div>
    </div>
  );
};

export default StoryPageComponent;