import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const ContactSkeleton = () => {
  return (
    <div>
      {
        Array.from(Array(10).keys()).map((_, i) => (
          <div key={i} className="my-5">
            <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
              <div className="flex gap-4 items-center">
                <Skeleton style={{width: "50px", height: "50px", borderRadius: "50%"}}/>
                <div className="flex-1">
                  <Skeleton style={{width: "200px"}}/>
                </div>
              </div>
            </SkeletonTheme>
          </div>
        ))
      }
    </div>
  );
};

export default ContactSkeleton;