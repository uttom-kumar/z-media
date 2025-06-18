import BlogPostStore from "../../store/post-list-store.js";
import {Link} from "react-router-dom";
import {format} from "date-fns";
import {AiFillLike, AiOutlineLike, AiTwotoneLike} from "react-icons/ai";
import {FaRegComment, FaShare} from "react-icons/fa";
import React, {useEffect, useRef, useState} from "react";
import {profileUrl} from "../../utility/utility.js";
import CreateCommentComponent from "../post-list/create-comment/create-comment-component.jsx";
import {GoKebabHorizontal} from "react-icons/go";
import PostDropdownTopUp from "../post-list/post-dropdown-topup/post-dropdown-top-up.jsx";
import toast from "react-hot-toast";
import ReactionStore from "../../store/reaction-store.js";
import PostListSkeleton from "../../skeleton/post-list-skeleton.jsx";
import PostModalComponent from "../post-list/post-modal/post-modal-component.jsx";
import ModalComponent from "../modal/modal-component.jsx";
import LikeButton from "../common/likeButton.jsx";

const UserPostComponent = () => {
  const { UserByBlogPostList} = BlogPostStore();
  const [showComment, setShowComment] = useState(false)
  const dropdownRef = useRef(null);
  const [showModalBtn, setShowModalBtn] = useState(false)
  const [showModal, setShowModal] = useState(false)


  const openModal = (postID) => {
    setShowModal(postID);
  };



  const handleShare = async (id) => {
    const url = location + "blogDetails/" + id
    if (navigator.share) {
      try {
        await navigator.share({
          title: '',
          text: '',
          url: url,
        });

      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing is not supported in this browser.');
    }
  };


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModalBtn(null); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);




  return (
    <div>
      {UserByBlogPostList === null ? (
        <div className="mt-10"><PostListSkeleton /></div>
      ) : (
        <>
          {UserByBlogPostList?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((post, i) => {
            const alreadyLiked = !!post?.Reaction[0]?.likeByUserID?.find((like) => like.userID === post?.user._id)?.liked;
            const formattedDate = format(new Date(post.createdAt), "dd MMM, yyyy 'at' h:mm a");
            return (
              <div key={i} className="p-5 bg-white border border-gray-200 shadow rounded mb-10">
                {/*profile section*/}
                <div className="flex items-start justify-between">
                  <div className="flex mb-3 items-start gap-2">
                    <img className="w-[40px] h-[40px] rounded-full" src={post?.profile[0]?.profilePicture || profileUrl}
                         alt="profile image"/>
                    <div>
                      <div className="flex items-center gap-1">
                        <p>{post?.user?.fullName}</p>
                        <div>
                          {
                            post?.role === "public" ? (<div>🌍</div>) : post?.role === "friends" ? (<div>👥</div>) :
                              post?.role === "only me" && (<div>🔒</div>)
                          }
                        </div>
                      </div>
                      <p className="text-[14px]">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="relative" ref={dropdownRef}>
                    <button className="cursor-pointer" onClick={() => setShowModalBtn(post?._id)}>
                    <GoKebabHorizontal/>
                    </button>
                    <div className="absolute top-[20px] right-0">
                      {showModalBtn === post?._id && (
                        <div
                          ref={dropdownRef}
                          className="w-[220px] msm:w-[300px] py-3 px-1 bg-white rounded animate-fade-in"
                          style={{boxShadow: "0 0 5px #ccc"}}
                        >
                          <PostDropdownTopUp blogID={post?._id} userID={post?.userID} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`mb-3 ${!post?.image && "hidden"}`}>{post?.title}</p>
                  <Link to={`/blogDetails/${post?._id}`}>
                    {post?.image ? (
                      <img
                        className={`w-full h-[400px] md:h-[500px] object-contain`}
                        src={post?.image}
                        alt="Post"
                      />
                    ) : (
                      <div
                        className="h-[400px] md:h-[400px] w-full flex flex-col justify-center items-center overflow-y-auto scrollbar-thin">
                        {post?.title}
                      </div>
                    )}
                  </Link>
                </div>
                {/*like section*/}
                <div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div></div>
                      <div className="mb-2">
                        <button
                          className="cursor-pointer"
                          onClick={() => openModal(post?._id)}
                        >
                          <span className="text-gray-700 font-bold">{post?.comment?.length || 0} comments</span>
                        </button>
                      </div>
                    </div>
                    <div
                      className="flex justify-between items-center gap-3 py-2 px-5 border-t border-t-gray-400 ">
                      <LikeButton
                          postId={post?._id}
                          userID={post?.userID}
                          initialLiked={alreadyLiked}
                          initialCount={post?.Reaction[0]?.like ?? 0}
                      />

                      <button className="text-[24px] cursor-pointer" onClick={() => setShowComment(post?._id)}>
                        <FaRegComment/>
                      </button>
                      <button
                        onClick={() => handleShare(post?._id)}
                        className="text-[20px] cursor-pointer ">
                        <FaShare/>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="animate-fade-in">
                  {showComment === post?._id && (
                    <>
                      <CreateCommentComponent blogID={post?._id} userID={post?.userID}/>
                    </>
                  )}
                </div>
                <ModalComponent isVisible={showModal} onClose={() => setShowModal(false)}>
                  <PostModalComponent onClose={setShowModal} postID={showModal}/>
                </ModalComponent>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default UserPostComponent;
