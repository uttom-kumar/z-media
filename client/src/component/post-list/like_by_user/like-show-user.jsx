import React, {useEffect} from 'react';
import ReactionStore from "../../../store/reaction-store.js";
import {Link} from "react-router-dom";
import {profileUrl} from "../../../utility/utility.js";

const LikeShowUser = ({blogID}) => {
  const{ReactionList,ReactionListRequest} = ReactionStore()
  useEffect(() => {
    (async () => {
      await ReactionListRequest(blogID)
    })()
  }, [blogID]);

  return (
    <div>
      <div className={'flex items-center relative -space-x-2'}>
        {
          ReactionList===null? (<div>loading...</div>):
            ReactionList?.slice(0,4)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((item, i) => {
            return (
              <div key={i} className="relative my-3">
                <Link to={`/profile/${item?.user?._id}`}>
                  <img className="w-[30px] h-[30px] rounded-full" src={item?.profile[0]?.profilePicture || profileUrl} alt=""/>
                </Link>
              </div>
            )
          })
        }
        {
          ReactionList?.slice(0,1)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((item, i)=>{
            return (
              <div key={i}>
                <p className="ml-[10px] flex items-center gap-1">{item?.user?.fullName} {item?.like > 1 && (<div>and others</div>)}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default LikeShowUser;