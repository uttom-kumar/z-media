import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const PostListSkeleton = () => {
  return (
    <>
      {
        Array.from(Array(10).keys()).map((_, i) => (
          <div key={i} className="my-10 shadow border border-gray-200 rounded">
            <SkeletonTheme baseColor="#ccc" highlightColor="#F8FAFC">
              <div className="w-full p-5 bg-white">
                <div className="flex gap-3 items-center">
                  <div><Skeleton style={{width: "50px", height: "50px", borderRadius: "50%"}}/></div>
                  <div>
                    <Skeleton style={{width: "150px"}}/>
                    <Skeleton style={{width: "100px"}}/>
                  </div>
                </div>
                <h1><Skeleton style={{width: "100%", marginTop: "10px"}}/></h1>
                <Skeleton style={{width: "100%", height: "500px", marginTop: "10px"}}/>
                <div className="block md:flex gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 mt-5">
                    <Skeleton style={{width: "50px", height: "50px", borderRadius: "50%"}}/>
                    <div>
                      <Skeleton style={{width: "150px"}}/>
                      <Skeleton style={{width: "150px"}}/>
                    </div>
                  </div>
                  <Skeleton style={{width: "150px", height: "30px", marginTop: "10px"}}/>
                </div>
              </div>
            </SkeletonTheme>
          </div>
        ))
      }
    </>
  );
};

export default PostListSkeleton;