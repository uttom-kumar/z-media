import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const CreatePostSkeleton = () => {
  return (
    <>
      <div>
        <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
          <div className="flex grid-cols-2 gap-4 items-center">
            <Skeleton style={{width: "50px", height: "50px", borderRadius: "50%"}}/>
            <div className="flex-1">
              <Skeleton style={{width: "100%", height: "50px"}}/>
            </div>
          </div>
        </SkeletonTheme>
      </div>
    </>
  );
};

export default CreatePostSkeleton;