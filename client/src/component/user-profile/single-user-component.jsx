import React, { useEffect, useState } from "react";
import UserStore from "../../store/user-store.js";
import BlogPostStore from "../../store/post-list-store.js";
import {Link, useParams} from "react-router-dom";
import SingleUserBlogListComponent from "./single-user-blog-list-component.jsx";
import SingleProfilePhotoTabComponent from "./single-profile-photo-tab-component.jsx";
import {profileUrl} from "../../utility/utility.js";
import cover_svg from "../../../public/images/cover_svg.svg"
import ProfileSkeleton from "../../skeleton/profile-skeleton.jsx";
import {FaCheckCircle, FaUserPlus} from "react-icons/fa";
import {BsFillPatchCheckFill} from "react-icons/bs";
import toast from "react-hot-toast";
import friendStore from "../../store/friend-store.js";
import SingleUserAbout from "./about/single-user-about.jsx";


const SingleUserComponent = () => {
  const { profileList, profileListRequest, singleProfileRead  ,singleProfileListRequest} = UserStore();
  const { UserBySingleListDetails, UserBySingleListDetailsRequest  } = BlogPostStore();
  const {acceptFollowRequest, UnFollowRequest , SendFollowRequest } = friendStore()
  const [activeTab, setActiveTab] = useState("Posts");

  const {userID} = useParams();


  const AddFriendHandler = async (id) => {
    let res = await SendFollowRequest(id);
    if (res === true) {
      await singleProfileListRequest(userID)
      // await profileListRequest();
      toast.success("Friend Request Successfully Sent!");
    } else {
      toast.error("Friend Request Failed.");
    }
  };

  const AcceptFriendHandler = async (id) => {
    let res = await acceptFollowRequest(id)
    if(res===true){
      await singleProfileListRequest(userID)
      toast.success('confirm friend request')
    }
    else {
      toast.error("Friend request failed")
    }
  };

  const UnFriendHandler = async (userID) => {
    let res = await UnFollowRequest(userID);
    if (res === true) {
      await singleProfileListRequest(userID)
      toast.success("Unfollowed Successfully");
    } else {
      toast.error("Unfollow Failed");
    }
  }

  const UnDeleteHandler = async (id) => {
    let res = await UnFollowRequest(id)
    if(res===true){
      await singleProfileListRequest(userID)
      toast.success('UnFollow friend request')
    }
    else {
      toast.error("Friend request failed")
    }
  };







  useEffect(() => {
    (async () => {
      await singleProfileListRequest(userID)
      await UserBySingleListDetailsRequest(userID)
      await profileListRequest()
    })()
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };


  const tabs = [
    { name: "Posts",  },
    { name: "Reels",  },
    { name: "Photo",  },
    { name: "Save", },
    { name: "About", },
  ];

  return (
    <>
      <div>
        {singleProfileRead === null ? (
          <div> <ProfileSkeleton /></div>
        ) : (
          singleProfileRead?.map((profile, i) => {
            return (
              <div key={i}>
                <div className=" w-[90%] lg:w-[80%] xl:w-[60%] mx-auto mb-16">
                  <div className="relative">
                    <img className="w-full h-[150px] lsm:h-[200px]" src={cover_svg} alt=""/>
                    <div className="absolute -bottom-[50px] left-[20px]">
                      <img
                        alt="Profile"
                        className="w-[100px] h-[100px] lsm:w-[150px] lsm:h-[150px] object-contain bg-white rounded-full border-[5px] border-gray-50 "
                        height={100}
                        src={profile?.profile[0]?.profilePicture || profileUrl}
                        width={100}
                      />
                    </div>
                  </div>
                </div>
                <div className=" w-[90%] lg:w-[80%] xl:w-[60%] mx-auto">
                  <div>
                    <div className="block lsm:flex items-center justify-start gap-5">
                      <div>
                        <p className="text-[22px]">{profile?.fullName}</p>
                      </div>
                      {
                        profileList?._id === profile?._id ? null : // Hide buttons if viewing own profile
                          profile?.friend?.followed?.some(friend => friend.userID === profileList[0]?._id) ? (
                            <button
                              className="px-3 py-2 rounded text-blue-400 font-semibold"
                            >
                              <span className="flex items-center gap-2"> Friend<BsFillPatchCheckFill /></span>
                            </button>
                          ) : profile?.friend?.following?.some(friend => friend.userID === profileList[0]?._id) ? (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={()=>AcceptFriendHandler(profile?._id)}
                                className="px-5 py-2 bg-blue-400 rounded text-white font-semibold"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={()=>UnDeleteHandler(profile?._id)}
                                className="px-5 py-2 bg-red-400 rounded text-white font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          ) : profile?.friend?.follower?.some(friend => friend.userID === profileList[0]?._id) ? (
                            <div>
                              <button
                                onClick={()=>UnFriendHandler(profile?._id)}
                                className="px-5 py-2 bg-blue-400 rounded text-white font-semibold"
                              >
                                Unfollow
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={()=>AddFriendHandler(profile?._id)}
                              className="px-5 py-2 bg-blue-400 rounded text-white font-semibold">
                              <span className="flex items-center gap-1"><FaUserPlus /> Add Friend</span>
                            </button>
                          )
                      }

                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-5">
                        {profileList?.[0]?._id === profile?._id && (
                          <>
                            <Link to={`/profile/update`}
                                  className="px-3 py-2 text-sm text-white font-semibold bg-blue-400 rounded">
                              Edit profile
                            </Link>
                            <button className="px-3 py-2 text-sm text-white font-semibold bg-blue-400 rounded">
                              View archive
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <p className="">
                        <span>{UserBySingleListDetails?.length}</span> posts
                      </p>
                      <p>
                        <Link to={`/friends/${profile?._id}`} className="hover:underline">
                          <span>{(profile?.friend?.follower?.length || 0) + (profile?.friend?.followed?.length || 0)}</span> followers
                        </Link>
                      </p>
                      <p>
                        <Link to={`/friends/${profile?._id}`} className="hover:underline">
                          <span>{profile?.friend?.following?.length || 0}</span> following
                        </Link>
                      </p>
                    </div>
                    <div>
                      <p className="my-2">{profile?.profile[0]?.bio}</p>
                    </div>
                  </div>
                </div>
                <div
                  className="w-[90%] lg:w-[80%] xl:w-[60%] mx-auto mt-5 border-b border-b-gray-400 overflow-x-auto">
                  <ul className="flex  gap-5 lg:gap-10">
                    {tabs.map((tab, index) => (
                      <li key={index} className={`text-gray-500 ${activeTab === tab.name ? "text-blue-400" : ""}`}>
                        <button
                          onClick={() => handleTabClick(tab.name)}
                          className={`px-4 py-2 text-center flex font-bold items-center gap-2 cursor-pointer ${
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
      <div className="w-[90%] lg:w-[80%] xl:w-[60%] mx-auto mt-5">
        {activeTab === "Posts" && <div><SingleUserBlogListComponent userID={userID}/></div>}
        {activeTab === "Reels" && <div>This is the REELS section content.</div>}
        {activeTab === "Photo" && <div><SingleProfilePhotoTabComponent/></div>}
        {activeTab === "Save" && <div>This is the SAVED section content.</div>}
        {activeTab === "About" && <div><SingleUserAbout /></div>}
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
      </div>

    </>
  );
};

export default SingleUserComponent;