import React, {useState} from 'react';
import liveIcon from '../../../../public/icons/c0dWho49-X3.png'
import galaryIcon from '../../../../public/icons/Ivw7nhRtXyo.png'
import mediaIcon from '../../../../public/icons/t2NS5_5UwDb.png'
import CreatePostModal from "../../modal/create-post-modal.jsx";
import CreatePostComponent from "./create-post-component.jsx";
import UserStore from "../../../store/user-store.js";
import {profileUrl} from "../../../utility/utility.js";
import CreatePostSkeleton from "../../../skeleton/create-post-skeleton.jsx";

const CreateBtnComponent = () => {
  const [showModal, setShowModal] = useState(false)
  const {profileList} = UserStore()

  return (
    <div>
      <div className="bg-white p-5 rounded-lg shadow  w-full ">
        {/* Input Area */}
        {
          profileList===null ? (<div><CreatePostSkeleton /></div>) :
          profileList?.map((profile, i) => {
            return (
              <div key={i} className="flex items-center space-x-4 mb-4">
                {/* Profile Picture */}
                <img
                  src={profile?.profile[0]?.profilePicture || profileUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-contain"
                />
                {/* Input */}
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 bg-gray-300 px-4 py-2 rounded-full focus:outline-none cursor-pointer"
                >
                  What&#39;s on your mind, {profile?.user?.fullName}
                </button>
              </div>
            )
          })
        }

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            className="flex items-center space-x-2 px-4 text-[24px] py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer">
            <img className="w-[30px] " src={liveIcon} alt=""/>
            <span className="text-sm hidden md:block">Live video</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 text-[24px] py-2 rounded-lg hover:bg-gray-200 transition  cursor-pointer">
            <img className="w-[30px] " src={galaryIcon} alt=""/>
            <span className="text-sm hidden md:block">Photo/video</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 text-[24px] py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer">
            <img className="w-[30px] " src={mediaIcon} alt=""/>
            <span className="text-sm hidden md:block">Reel</span>
          </button>
        </div>
      </div>
      <div>
        <CreatePostModal isVisible={showModal} onClose={() => setShowModal(false)}>
          <CreatePostComponent onClose={setShowModal}/>
        </CreatePostModal >
      </div>
    </div>
  );
};

export default CreateBtnComponent;