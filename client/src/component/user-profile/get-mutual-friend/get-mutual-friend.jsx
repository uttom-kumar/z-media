import React, {useEffect} from 'react';
import {profileUrl} from "../../../utility/utility.js";
import FriendStore from "../../../store/friend-store.js";
import {GoDotFill} from "react-icons/go";
import {Link} from "react-router-dom";
import ContactSkeleton from "../../../skeleton/contact-skeleton.jsx";

const GetMutualFriend = ({userID}) => {
  const {MutualFriendList, getMutualFriendListRequest} =FriendStore()


  useEffect(() => {
    (async () => {
      await getMutualFriendListRequest(userID)
    })()
  }, []);

  return (
    <div>
      {
        MutualFriendList?.map((user, i) => {
          return (
            <div key={i}>
              <div className="flex items-center gap-2 my-5">
                <div className="flex items-center -space-x-3 space-y-4">
                  <img className="w-[40px] h-[40px] rounded-full border-[2px] border-green-400" src={user?.profile[0]?.profilePicture || profileUrl}
                       alt="profileImage"
                  />
                  <div>
                    <GoDotFill className="text-[24px] text-green-400" />
                  </div>
                </div>
                <Link to={`/message`}>
                  <p className="font-semibold">{user?.user?.fullName}</p>
                </Link>
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default GetMutualFriend;