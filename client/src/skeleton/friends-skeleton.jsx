import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const FriendsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5">
      {
        Array.from(Array(15).keys()).map((_, i) => (
          <div key={i} className="my-3 bg-white p-4 rounded">
            <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton style={{width:"50px", height:"50px", borderRadius: "50%"}} />
                  <div>
                    <Skeleton style={{width:"170px"}} />
                    <Skeleton style={{width:"170px"}} />
                  </div>
                </div>
                <div>
                  <Skeleton style={{width:"130px", height:"40px" , borderRadius: "20px"}} />
                </div>
              </div>
            </SkeletonTheme>
          </div>
        ))
      }
    </div>
  );
};

export default FriendsSkeleton;