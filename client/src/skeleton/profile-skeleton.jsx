import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="lsm:space-x-4 w-[90%] lg:w-[80%] xl:w-[60%] mx-auto">
      <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
        <div>
          <div className="relative mb-20">
            <Skeleton style={{width: "100%", height: "170px", borderRadius: "10px"}}/>
            <div className="absolute -bottom-[50px] left-[20px]">
              <Skeleton style={{width: "150px", height: "150px", borderRadius: "50%", border:"5px solid white"}}/>
            </div>
          </div>
          <div className="">
            <div className="md:flex items-center gap-3">
              <Skeleton style={{width: "200px", height: "30px"}}/>
              <Skeleton style={{width: "100px", height: "30px"}}/>
              <Skeleton style={{width: "80px", height: "30px"}}/>
            </div>
            <div className="block md:flex items-center gap-3 mt-3">
              <Skeleton style={{width: "100px", height: "30px"}}/>
              <Skeleton style={{width: "200px", height: "30px"}}/>
              <Skeleton style={{width: "80px", height: "30px"}}/>
            </div>
            <div>
              <Skeleton count={3} style={{width: "100%",}}/>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default ProfileSkeleton;