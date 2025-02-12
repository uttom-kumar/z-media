import React, {useEffect, useState} from 'react';
import {profileUrl} from "../../utility/utility.js";
import {Link} from "react-router-dom";
import FriendStore from "../../store/friend-store.js";
import UserStore from "../../store/user-store.js";
import toast from "react-hot-toast";
import GetMutualFriend from "../user-profile/get-mutual-friend/get-mutual-friend.jsx";
import SuggestedUserSkeleton from "../../skeleton/suggested-user-skeleton.jsx";
import ContactSkeleton from "../../skeleton/contact-skeleton.jsx";

const PostListRightComponent = () => {
  const {allUserList, allUserListRequest,profileList, profileListRequest} = UserStore()
  const {  SendFollowRequest } = FriendStore()


  const AddFriendHandler = async (id)=>{
    let res = await SendFollowRequest(id)
    if(res===true){
      await profileListRequest()
      await allUserListRequest()
      toast.success("Friend Request Successfully")
    }else{
      toast.error("Friend request failed")
    }
  }


  useEffect(() => {
    (async ()=> {
      await allUserListRequest()
    })()
  }, []);

  return (
    <div>
      <div>
        <h1 className="flex items-center gap-5">
          <span>Suggested for you</span>
          {profileList?.map((user,i)=>(
            <Link key={i} className="hover:underline duration-200" to={`/friends/${user?._id}`}>See all</Link>
          ))}
        </h1>
        {
          allUserList===null ? (<div><SuggestedUserSkeleton /> </div>) :
          allUserList?.slice(0,10)?.map((user, i) => {
            return (
              <div key={i}>
                <div>
                  <div className="flex items-start gap-4 my-1 py-2 px-5 rounded">
                    <Link to={`/profile/${user?._id}`}>
                      <img className="w-[50px] h-[50px] rounded-full" src={user?.profile?.profilePicture || profileUrl}
                           alt="profile logo"/>
                    </Link>
                    <div>
                      <Link to={`/profile/${user?._id}`} className="hover:underline">
                        <h3>{user?.fullName}</h3>
                      </Link>
                      <button
                        onClick={()=>AddFriendHandler(user?._id)}
                        className="px-3 py-1 bg-blue-400 text-white rounded">
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>


      {/*----------- contact user ------------*/}
      <div className="my-5">
        <h1 className="font-semibold">Contacts Friends</h1>
        {profileList===null? (<div><ContactSkeleton /></div>):
          profileList?.map((user, i) => {
          return (
            <div key={i}>
              <GetMutualFriend userID={user?._id}/>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PostListRightComponent;