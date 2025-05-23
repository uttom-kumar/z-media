import React from 'react';
import BlogPostStore from "../../store/post-list-store.js";
import {Link} from "react-router-dom";
import PhotoSkeleton from "../../skeleton/photo-skeleton.jsx";



const ProfileTabComponent = () => {
  const { UserByBlogPostList } = BlogPostStore();

  return (
    <div className="mb-10">
      <div>
        {UserByBlogPostList === null ? (
          <div><PhotoSkeleton /></div>
        ) : (
          <div className="grid grid-cols-2 min-sm:grid-cols-3 md:grid-cols-5 items-start gap-6">
            {UserByBlogPostList?.slice()
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              ?.map((photo, index) => {
                console.log(photo);
                return (
                  <div key={index} className="">
                    {photo?.image ? (
                      <Link to={`/blogDetails/${photo?._id}`}>
                        <img
                          className="w-full h-[230px] object-contain bg-white border border-gray-200 rounded shadow"
                          src={photo?.image}
                          alt="photo"
                        />
                      </Link>
                    ) : (
                      <div className="h-0"></div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabComponent;