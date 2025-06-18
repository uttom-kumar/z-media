import React from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SinglePostListSkeleton = () => {
  return (
      <div className="my-10 shadow border border-gray-200 rounded">
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
          <div className="w-full p-4 bg-white">
            {/* Header: Profile + Name */}
            <div className="flex items-center gap-3">
              <Skeleton circle width={45} height={45} />
              <div className="flex flex-col">
                <Skeleton width={120} height={14} />
                <Skeleton width={100} height={12} />
              </div>
            </div>

            {/* Post Text */}
            <div className="mt-4">
              <Skeleton width={60} height={12} />
            </div>

            {/* Image */}
            <div className="mt-4">
              <Skeleton height={400} />
            </div>

            {/* Likes + Comment Count */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-2">
                <Skeleton circle width={25} height={25} />
                <Skeleton width={60} height={12} />
              </div>
              <Skeleton width={30} height={12} />
            </div>

            {/* Input comment box */}
            <div className="mt-4 flex items-center gap-2 px-2">
              <Skeleton circle width={35} height={35} />
              <Skeleton height={35} width="100%" />
            </div>
          </div>
        </SkeletonTheme>
      </div>
  );
};

export default SinglePostListSkeleton;
