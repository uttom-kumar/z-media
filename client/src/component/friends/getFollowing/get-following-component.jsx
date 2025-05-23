import React, {useEffect} from 'react';
import friendStore from "../../../store/friend-store.js";
import {Link, useParams} from "react-router-dom";
import {profileUrl} from "../../../utility/utility.js";
import toast from "react-hot-toast";
import UserStore from "../../../store/user-store.js";
import FriendsSkeleton from "../../../skeleton/friends-skeleton.jsx";

const GetFollowingComponent = () => {
  const {FollowingList, getFollowingRequest,UnFollowRequest} = friendStore()
  const {allUserListRequest} = UserStore()

  const{id} = useParams();



  const UnFriendHandler = async (userID) => {
    // Call the API to unfollow
    let res = await UnFollowRequest(userID);
    if (res === true) {
      // Call the function to get the updated following list
      await getFollowingRequest(id);
      await allUserListRequest();
      toast.success("Unfollowed Successfully");
    } else {
      toast.error("Unfollow Failed");
    }
  }




  useEffect(()=>{
    (async ()=>{
      await getFollowingRequest(id)
    })()
  },[id])

  return (
    <>
      <div>
        {
          FollowingList===null? (<div><FriendsSkeleton/></div>) :(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {
                FollowingList?.map((user,i)=>{
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center p-4 rounded shadow bg-white">
                        <div className="flex items-center gap-2">
                          <Link to={`/profile/${user?.user?._id}`}>
                            <img className="w-[50px] h-[50px] rounded-full"
                                 src={user?.profile?.profilePicture || profileUrl} alt=""
                            />
                          </Link>
                          <div>
                            <Link to={`/profile/${user?.user?._id}`} className="hover:underline">
                              <p>{user?.user?.fullName}</p>
                            </Link>
                            <p>{user?.user?.username}</p>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={()=>UnFriendHandler(user?.user?._id)}
                            className="px-5 py-2 bg-red-500 rounded-[20px] font-semibold text-white">
                            Unfollow
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

export default GetFollowingComponent;