import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {IoMdNotifications} from "react-icons/io";
import {FaFacebookMessenger} from "react-icons/fa";
import UserStore from "../../store/user-store.js";
import {profileUrl} from "../../utility/utility.js";
import navbar_icon from '../../../public/icons/logo_icon.png'

const CommentHeader = () => {
  const {profileList, profileListRequest } = UserStore()
  useEffect(() => {
    (async () => {
      await profileListRequest()
    })()
  },[])
  return (
    <div>
      <div className=" px-3 py-2 border-b-2 border-gray-200 bg-slate-100 z-50">
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-start">
            <Link to={'/'} className="flex items-center">
              <img className=" w-[40px] h-[40px] object-contain" src={navbar_icon} alt=""/>
              <h1 className="block lg:hidden text-2xl md:text-[26px] lg:text-2xl font-bold font-[cursive]">Media</h1>
            </Link>
          </div>
          <ul className="flex items-center gap-2">
            <li>
            <Link className="w-[40px] h-[40px] text-[30px] rounded-full flex bg-gray-300 items-center justify-center"
                    to={`/notifications`}>
                <IoMdNotifications/>
              </Link>
            </li>
            <li>
              <Link className="w-[40px] h-[40px] text-[24px] rounded-full flex bg-gray-300 items-center justify-center"
                    to={`/message`}>
                <FaFacebookMessenger/>
              </Link>
            </li>
            <li>
              <Link className="w-[40px] h-[40px] text-[24px] rounded-full flex bg-gray-300 items-center justify-center"
                    to={`/profile`}>
                {
                  profileList?.map((profile, i) => {
                    return (
                      <div key={i}>
                        <img
                          className="w-[40px] h-[40px] rounded-full"
                          src={profile?.profile[0]?.profilePicture || profileUrl}
                          alt="User Profile"
                        />
                      </div>
                    )
                  })
                }
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommentHeader;