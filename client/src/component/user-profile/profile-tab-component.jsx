import React from 'react';
import BlogPostStore from "../../store/post-list-store.js";
import {Link} from "react-router-dom";
import PhotoSkeleton from "../../skeleton/photo-skeleton.jsx";

const ProfileTabComponent = () => {
  const { UserByBlogPostList } = BlogPostStore();

  return (
    <div>
      <div>
        {UserByBlogPostList === null ? (
          <div><PhotoSkeleton /></div>
        ) : (
          <div className="grid grid-cols-1 lsm:grid-cols-3 md:grid-cols-4 gap-5">
            {UserByBlogPostList?.slice()
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              ?.map((photo, index) => {
                console.log(photo);
                return (
                  <div key={index} className="">
                    {photo?.image ? (
                      <Link to={`/blogDetails/${photo?._id}`}>
                        <img
                          className="w-full h-[250px] object-contain bg-white border rounded shadow-lg"
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