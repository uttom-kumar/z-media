import React, { useEffect, useState } from "react";
import UserStore from "../../store/user-store.js";
import BlogPostStore from "../../store/post-list-store.js";
import UserPostComponent from "./user-post-component.jsx";
import ProfileTabComponent from "./profile-tab-component.jsx";
import {profileUrl} from "../../utility/utility.js";
import {Link} from "react-router-dom";
import ProfileSkeleton from "../../skeleton/profile-skeleton.jsx";
import AboutComponent from "./about/about-component.jsx";
import cover_svg from "../../../public/images/cover_svg.svg"


const UserProfile = () => {
  const { profileList, profileListRequest } = UserStore();
  const { UserByBlogPostList, UserByBlogPostListRequest } = BlogPostStore();
  const [activeTab, setActiveTab] = useState("Posts");


  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };


  useEffect(() => {
    (async () => {
      await profileListRequest();
      await UserByBlogPostListRequest();
    })();
  }, []);

  const tabs = [
    { name: "Posts", },
    { name: "Reels",  },
    { name: "Photo",  },
    { name: "Saved",  },
    { name: "About",  },
  ];

  return (
    <>
      <div className="">
        {profileList === null ? (
          <div><ProfileSkeleton /></div>
        ) : (
          profileList?.map((profile, i) => {
            return  (
              <div key={i}>
                <div
                  className="w-[90%] lg:w-[80%] xl:w-[60%] mx-auto animate-fade-in mb-[70px]">
                  <div className="relative">
                    <img className="w-full h-[150px] lsm:h-[200px]" src={cover_svg} alt=""/>
                    <div className="absolute -bottom-[50px] left-[20px]">
                      <img
                        alt="Profile"
                        className="w-[100px] h-[100px] lsm:w-[150px] lsm:h-[150px] object-contain bg-white rounded-full border-[5px] border-gray-50 "
                        src={profile?.profile[0]?.profilePicture || profileUrl}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[90%] lg:w-[80%] xl:w-[60%] mx-auto animate-fade-in">
                  <div className="">
                    <p className="text-[24px]  ">{profile?.fullName}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-5">
                      <Link to={`/profile/update/info`}
                            className="px-3 py-2 text-sm text-white font-semibold bg-blue-400 rounded">
                        Edit profile
                      </Link>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-2">
                      <span className="">
                        {UserByBlogPostList?.length} posts
                      </span>
                    <Link to={`/friends/${profile?._id}`} className="hover:underline">
                      {(profile?.follow[0]?.follower?.length || 0) + (profile?.follow[0]?.followed?.length || 0)} followers
                    </Link>
                    <Link to={`/friends/${profile?._id}`} className="hover:underline">
                      {profile?.follow[0]?.following?.length || 0} following
                    </Link>
                  </div>
                  <div>
                    <p className="mt-2 text-md  ">{profile?.profile[0]?.bio}</p>
                  </div>
                </div>
                <div
                  className="w-[90%] lg:w-[80%] xl:w-[60%] mx-auto mt-5 border-b border-b-gray-400 overflow-x-auto">
                  <ul className="flex  gap-5 lg:gap-10">
                    {tabs.map((tab, index) => (
                      <li key={index} className={`text-gray-500 ${activeTab === tab.name ? "text-blue-400" : ""}`}>
                        <button
                          onClick={() => handleTabClick(tab.name)}
                          className={`cursor-pointer px-4 py-2 text-center flex font-bold items-center gap-2 ${
                            activeTab === tab.name
                              ? "border-b-2 border-b-blue-400 text-blue-400 font-bold"
                              : " hover:border-b-blue-500"
                          }`}
                        >
                          {tab.icon}
                          <span>{tab.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="w-[90%] lg:w-[80%] xl:w-[60%] mx-auto mt-5 animate-fade-in">
        {activeTab === "Posts" && <div className="animate-fade-in"><UserPostComponent/></div>}
        {activeTab === "Reels" && <div className="animate-fade-in">This is the REELS section content.</div>}
        {activeTab === "Photo" && <div className="animate-fade-in"><ProfileTabComponent/></div>}
        {activeTab === "Saved" && <div className="animate-fade-in">This is the SAVED section content.</div>}
        {activeTab === "About" && <div className="animate-fade-in"><AboutComponent/></div>}
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
      </div>


    </>
  );
};

export default UserProfile;
