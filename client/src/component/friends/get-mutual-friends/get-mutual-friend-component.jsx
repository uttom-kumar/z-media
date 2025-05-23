import React, {useEffect} from 'react';
import {profileUrl} from "../../../utility/utility.js";
import {Link, useParams} from "react-router-dom";
import friendStore from "../../../store/friend-store.js";
import toast from "react-hot-toast";
import UserStore from "../../../store/user-store.js";
import FriendsSkeleton from "../../../skeleton/friends-skeleton.jsx";

const GetMutualFriendComponent = () => {
  const {MutualFriendList, getMutualFriendListRequest, UnFollowRequest}= friendStore()
  const {allUserListRequest} = UserStore()
  let {id} = useParams()



  const UnFriendHandler = async (userID) => {
    let res = await UnFollowRequest(userID)
    if(res===true){
      await getMutualFriendListRequest(id)
      await allUserListRequest()
      toast.success("UnFriend Successfully")
    }
  }


  useEffect(() => {
    (async () => {
      await getMutualFriendListRequest(id)
    })()
  }, [id]);

  return (
    <div>
      {
        MutualFriendList===null? (<div><FriendsSkeleton /></div>) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {
              MutualFriendList?.map((user,i)=>{
                return (
                  <div key={i}>
                    <div>
                      <div className="flex items-center justify-between p-4 bg-white shadow rounded">
                        <div className="flex items-center gap-3">
                          <Link to={`/profile/${user?.user?._id}`}>
                            <img className="w-[50px] h-[50px] object-contain rounded-full"
                                 src={user?.profile[0]?.profilePicture || profileUrl}
                                 alt="profileImage"
                            />
                          </Link>
                          <div className="">
                            <Link to={`/profile/${user?.user?._id}`} className="hover:underline">
                              <p className="font-semibold leading-none">{user?.user?.fullName}</p>
                            </Link>
                            <p className="">{user?.user?.username}</p>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => UnFriendHandler(user?.user?._id)}
                            className="px-4 py-2 bg-red-400 rounded-[20px] font-semibold text-white"
                          >
                            Unfriend
                          </button>
                        </div>
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
  );
};

export default GetMutualFriendComponent;