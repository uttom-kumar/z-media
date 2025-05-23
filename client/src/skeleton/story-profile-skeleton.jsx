import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const StoryProfileSkeleton = () => {
  return (
    <div>
      <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
        <div>
          <Skeleton style={{width:"100%" , height:"180px", borderRadius:"10px"}}></Skeleton>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default StoryProfileSkeleton;