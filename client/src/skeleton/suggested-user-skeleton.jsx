import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const SuggestedUserSkeleton = () => {
  return (
    <div>
      {
        Array.from(Array(7).keys()).map((_, i) => (
          <div key={i} className="my-4">
            <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
              <div>
                <div className="flex items-center gap-3">
                  <Skeleton style={{width: "50px", height: "50px", borderRadius: "50%"}} />
                  <div>
                    <Skeleton style={{width: "200px"}} />
                    <Skeleton style={{width: "200px", height:"30px"}} />
                  </div>
                </div>
              </div>
            </SkeletonTheme>
          </div>
        ))
      }
    </div>
  );
};

export default SuggestedUserSkeleton;