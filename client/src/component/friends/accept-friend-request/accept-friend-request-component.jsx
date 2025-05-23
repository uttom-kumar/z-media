import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import friendStore from "../../../store/friend-store.js";
import { profileUrl } from "../../../utility/utility.js";
import toast from "react-hot-toast";
import {BsThreeDots} from "react-icons/bs";
import FriendsSkeleton from "../../../skeleton/friends-skeleton.jsx";

const AcceptFriendRequestComponent = () => {
  const {FollowerList, getFollowerRequest, getFollowingRequest, UnFollowRequest, acceptFollowRequest } = friendStore();
  const { id } = useParams();
  const [activeBtn, setActiveBtn] = useState(false)
  const dropdownRef = useRef(null);

  const AcceptFriendHandler = async (userID) => {
    let res = await acceptFollowRequest(userID)
    if(res===true){
      await getFollowerRequest(id)
      await getFollowingRequest(id)
      toast.success('confirm friend request')
    }
    else {
      toast.error("Friend request failed")
    }
  };
  const UnFriendHandler = async (userID) => {
    let res = await UnFollowRequest(userID)
    if(res===true){
      await getFollowingRequest(id)
      await getFollowerRequest(id)
      toast.success('UnFollow friend request')
    }
    else {
      toast.error("Friend request failed")
    }
  };



  const handlerShow = (id) => {
    setActiveBtn((prev) => (prev === id ? null : id));
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveBtn(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  useEffect(() => {
    (async () => {
      await getFollowerRequest(id);
      await getFollowingRequest(id);
    })();
  }, [id]);





  return (
    <div>
      {FollowerList == null ? (
        <div>
          <FriendsSkeleton/>
        </div>
      ) : (
        <div className="grid  lg:grid-cols-2 gap-6">
          {
            FollowerList?.map((user, i) => {
            return (
              <div key={i} className="flex justify-between items-center bg-white py-2 px-4 shadow-lg rounded-lg cursor-pointer">
                <div className="flex items-center gap-5">
                  <Link to={`/profile/${user?.user?._id}`}>
                    <img
                      className="w-[50px] h-[50px] object-contain rounded-full"
                      src={user?.profile?.profilePicture || profileUrl}
                      alt={user?.user?.fullName}
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/profile/${user?.user?._id}`} className="text-start hover:underline">
                      <p className="leading-none">{user?.user?.fullName}</p>
                    </Link>
                    <p className="">{user?.user?.username}</p>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <div>
                    <button onClick={() => handlerShow(user?.user?._id)}>
                      <BsThreeDots />
                    </button>
                  </div>

                    {
                      activeBtn === user?.user?._id && (
                        <div ref={dropdownRef} className="absolute right-[20px]  top-[10px] w-[150px] bg-white p-4 rounded shadow-lg border-[2px]">
                          <button
                            onClick={() => AcceptFriendHandler(user?.user?._id)}
                            className="w-full mb-2 py-2 bg-blue-500 hover:bg-blue-600 transition rounded-lg font-semibold text-white"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => UnFriendHandler(user?.user?._id)}
                            className="w-full py-2 bg-red-500 hover:bg-red-600 transition rounded-lg font-semibold text-white"
                          >
                            Delete
                          </button>
                        </div>
                      )
                    }
                  </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default AcceptFriendRequestComponent;
