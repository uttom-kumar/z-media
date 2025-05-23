import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const StoryTextSkeleton = () => {
  return (
    <div className="">
      <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
        <div>
          <Skeleton style={{width:"250px" , height:"180px", borderRadius:"10px"}}></Skeleton>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default StoryTextSkeleton;