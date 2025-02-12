import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const PhotoSkeleton = () => {
  return (
    <div className="grid lsm:grid-cols-2 md:grid-cols-4">
      {
        Array.from(Array(10).keys()).map((_, i) => (
          <div key={i} className="my-2">
            <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
              <Skeleton style={{width:"100%", height:"200px"}} />
            </SkeletonTheme>
          </div>
        ))
      }
    </div>
  );
};

export default PhotoSkeleton;