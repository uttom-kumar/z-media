import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { profileUrl } from "../../../utility/utility.js";
import UserStore from "../../../store/user-store.js";
import FriendStore from "../../../store/friend-store.js";
import toast from "react-hot-toast";
import FriendsSkeleton from "../../../skeleton/friends-skeleton.jsx";

const GetAllSuggestedUser = () => {
  const { allUserList, allUserListRequest, profileListRequest } = UserStore();
  const { SendFollowRequest } = FriendStore();

  // Function to handle sending friend requests
  const AddFriendHandler = async (id) => {
    let res = await SendFollowRequest(id);
    if (res === true) {
      await profileListRequest();
      await allUserListRequest();
      toast.success("Friend Request Successfully Sent!");
    } else {
      toast.error("Friend Request Failed.");
    }
  };

  // Fetching all user data when component mounts
  useEffect(() => {
    (async () => {
      await allUserListRequest();
    })();
  }, [allUserListRequest]);

  return (
    <>
      <div>
        {
          allUserList === null ? (<div><FriendsSkeleton/></div>) : (
            <div  className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {
                allUserList?.map((user, i) => {
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center p-4 rounded shadow bg-white">
                        <div className="flex items-center gap-2">
                          <Link to={`/profile/${user?._id}`} className="flex-shrink-0">
                            <img className="w-[50px] h-[50px] object-contain rounded-full"
                                 src={user?.profile?.profilePicture || profileUrl}
                                 alt="profile logo"/>
                          </Link>
                          <div>
                            <Link to={`/profile/${user?._id}`} className="hover:underline ">
                              <h3 className="text-lg leading-none">{user?.fullName}</h3>
                            </Link>
                            <h3 className="text-lg">{user?.username}</h3>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => AddFriendHandler(user?._id)}
                            className="px-2 py-1 lsm:px-5 lsm:py-2 bg-blue-400 rounded font-semibold text-white">
                            Add Friend
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </div>
    </>
  );
};

export default GetAllSuggestedUser;
